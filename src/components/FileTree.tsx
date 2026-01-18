"use client";

import { useState } from "react";
import {
  Folder,
  FileText,
  ChevronRight,
  ChevronDown,
  Loader2,
  FilePlus,
  FolderPlus,
  Trash2,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEditorStore } from "@/store/useEditorStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { DriveFile } from "@/lib/schema";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  useFiles,
  useFileContent,
  useCreateFile,
  useCreateFolder,
  useDeleteFile,
  queryKeys,
} from "@/hooks/useApi";

interface FileItemProps {
  item: DriveFile;
  level?: number;
  parentId: string;
}

const FileItem = ({ item, level = 0, parentId }: FileItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentFileId, setFile, setLoading, clearFile } = useEditorStore();
  const queryClient = useQueryClient();

  // Dialog states
  const [showCreateFileDialog, setShowCreateFileDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [newName, setNewName] = useState("");

  const isFolder = item.mimeType === "application/vnd.google-apps.folder";
  const isSelected = currentFileId === item.id;

  // TanStack Query hooks
  const { data: children = [], isLoading: isLoadingChildren } = useFiles(
    isOpen ? item.id : null
  );

  const createFileMutation = useCreateFile();
  const createFolderMutation = useCreateFolder();
  const deleteMutation = useDeleteFile(parentId);

  const handleClick = async () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    } else {
      setLoading(true);
      try {
        const res = await fetch(`/api/read?fileId=${item.id}`);
        if (!res.ok) throw new Error("Failed to read file");
        const text = await res.text();
        setFile(item.id, item.name, text);
      } catch (error) {
        console.error("Failed to read file:", error);
        toast.error("파일을 읽는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateFile = () => {
    if (!newName.trim()) return;

    const fileName =
      newName.endsWith(".mdx") || newName.endsWith(".md")
        ? newName
        : `${newName}.mdx`;

    createFileMutation.mutate(
      { name: fileName, parentId: isFolder ? item.id : parentId },
      {
        onSuccess: () => {
          toast.success("파일이 생성되었습니다.");
          setShowCreateFileDialog(false);
          setNewName("");
          if (isFolder) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.files(item.id),
            });
            setIsOpen(true);
          }
        },
        onError: () => {
          toast.error("파일 생성에 실패했습니다.");
        },
      }
    );
  };

  const handleCreateFolder = () => {
    if (!newName.trim()) return;

    createFolderMutation.mutate(
      { name: newName, parentId: isFolder ? item.id : parentId },
      {
        onSuccess: () => {
          toast.success("폴더가 생성되었습니다.");
          setShowCreateFolderDialog(false);
          setNewName("");
          if (isFolder) {
            queryClient.invalidateQueries({
              queryKey: queryKeys.files(item.id),
            });
            setIsOpen(true);
          }
        },
        onError: () => {
          toast.error("폴더 생성에 실패했습니다.");
        },
      }
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(item.id, {
      onSuccess: () => {
        toast.success(
          isFolder ? "폴더가 삭제되었습니다." : "파일이 삭제되었습니다."
        );
        setShowDeleteDialog(false);
        if (currentFileId === item.id) {
          clearFile();
        }
      },
      onError: () => {
        toast.error("삭제에 실패했습니다.");
      },
    });
  };

  return (
    <div>
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            onClick={handleClick}
            className={cn(
              "flex items-center gap-2 py-1.5 px-2 rounded-sm cursor-pointer text-sm transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isSelected && "bg-accent text-accent-foreground",
              !isFolder && "text-muted-foreground"
            )}
            style={{ paddingLeft: `${level * 12 + 8}px` }}
          >
            {isFolder ? (
              isLoadingChildren ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            ) : (
              <span className="w-4" />
            )}

            {isFolder ? (
              <Folder className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <FileText className="w-4 h-4 shrink-0" />
            )}

            <span className="truncate flex-1">{item.name}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => setShowCreateFileDialog(true)}>
            <FilePlus className="w-4 h-4 mr-2" />
            새 파일
          </ContextMenuItem>
          <ContextMenuItem onClick={() => setShowCreateFolderDialog(true)}>
            <FolderPlus className="w-4 h-4 mr-2" />
            새 폴더
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            삭제
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {isOpen && children.length > 0 && (
        <div>
          {children.map((child) => (
            <FileItem
              key={child.id}
              item={child}
              level={level + 1}
              parentId={item.id}
            />
          ))}
        </div>
      )}

      {/* Create File Dialog */}
      <Dialog open={showCreateFileDialog} onOpenChange={setShowCreateFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 파일 만들기</DialogTitle>
            <DialogDescription>
              {isFolder ? item.name : "현재 폴더"}에 새 파일을 만듭니다.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="파일 이름 (예: new-post.mdx)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateFileDialog(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateFile}
              disabled={createFileMutation.isPending || !newName.trim()}
            >
              {createFileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 폴더 만들기</DialogTitle>
            <DialogDescription>
              {isFolder ? item.name : "현재 폴더"}에 새 폴더를 만듭니다.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="폴더 이름"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateFolderDialog(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={createFolderMutation.isPending || !newName.trim()}
            >
              {createFolderMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{item.name}&quot;을(를) 삭제합니다.
              {isFolder && " 폴더 안의 모든 파일도 함께 삭제됩니다."}
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default function FileTree() {
  const { rootFolderId } = useSettingsStore();
  const queryClient = useQueryClient();

  // Dialog states for root level
  const [showCreateFileDialog, setShowCreateFileDialog] = useState(false);
  const [showCreateFolderDialog, setShowCreateFolderDialog] = useState(false);
  const [newName, setNewName] = useState("");

  // TanStack Query hooks
  const { data: files = [], isLoading, error } = useFiles(rootFolderId);
  const createFileMutation = useCreateFile();
  const createFolderMutation = useCreateFolder();

  const handleCreateFile = () => {
    if (!newName.trim() || !rootFolderId) return;

    const fileName =
      newName.endsWith(".mdx") || newName.endsWith(".md")
        ? newName
        : `${newName}.mdx`;

    createFileMutation.mutate(
      { name: fileName, parentId: rootFolderId },
      {
        onSuccess: () => {
          toast.success("파일이 생성되었습니다.");
          setShowCreateFileDialog(false);
          setNewName("");
        },
        onError: () => {
          toast.error("파일 생성에 실패했습니다.");
        },
      }
    );
  };

  const handleCreateFolder = () => {
    if (!newName.trim() || !rootFolderId) return;

    createFolderMutation.mutate(
      { name: newName, parentId: rootFolderId },
      {
        onSuccess: () => {
          toast.success("폴더가 생성되었습니다.");
          setShowCreateFolderDialog(false);
          setNewName("");
        },
        onError: () => {
          toast.error("폴더 생성에 실패했습니다.");
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive p-2">
        파일 목록을 불러올 수 없습니다.
      </div>
    );
  }

  if (!rootFolderId) {
    return (
      <div className="text-sm text-destructive p-2">
        루트 폴더가 설정되지 않았습니다.
      </div>
    );
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger className="flex flex-col gap-0.5 min-h-[200px]">
        {files.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">
            파일이 없습니다. 우클릭하여 파일을 추가하세요.
          </div>
        ) : (
          files.map((file) => (
            <FileItem key={file.id} item={file} parentId={rootFolderId} />
          ))
        )}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => setShowCreateFileDialog(true)}>
          <FilePlus className="w-4 h-4 mr-2" />
          새 파일
        </ContextMenuItem>
        <ContextMenuItem onClick={() => setShowCreateFolderDialog(true)}>
          <FolderPlus className="w-4 h-4 mr-2" />
          새 폴더
        </ContextMenuItem>
      </ContextMenuContent>

      {/* Create File Dialog */}
      <Dialog open={showCreateFileDialog} onOpenChange={setShowCreateFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 파일 만들기</DialogTitle>
            <DialogDescription>루트 폴더에 새 파일을 만듭니다.</DialogDescription>
          </DialogHeader>
          <Input
            placeholder="파일 이름 (예: new-post.mdx)"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFile()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateFileDialog(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateFile}
              disabled={createFileMutation.isPending || !newName.trim()}
            >
              {createFileMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Folder Dialog */}
      <Dialog
        open={showCreateFolderDialog}
        onOpenChange={setShowCreateFolderDialog}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 폴더 만들기</DialogTitle>
            <DialogDescription>
              루트 폴더에 새 폴더를 만듭니다.
            </DialogDescription>
          </DialogHeader>
          <Input
            placeholder="폴더 이름"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
          />
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateFolderDialog(false)}
            >
              취소
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={createFolderMutation.isPending || !newName.trim()}
            >
              {createFolderMutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              만들기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ContextMenu>
  );
}
