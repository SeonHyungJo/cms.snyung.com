"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Editor from "@monaco-editor/react";
import { Save, FileWarning, LogOut, Eye, EyeOff, Palette, ChevronDown, Loader2, Minus, Plus, Type, Settings, PanelLeftClose, PanelLeft } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

import { useEditorStore } from "@/store/useEditorStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import FileTree from "@/components/FileTree";
import MdxPreview from "@/components/MdxPreview";
import { useSaveFile, useRenameFile } from "@/hooks/useApi";

type EditorTheme = "vs-dark" | "vs-light" | "hc-black";

const editorThemes: { value: EditorTheme; label: string }[] = [
  { value: "vs-dark", label: "Dark" },
  { value: "vs-light", label: "Light" },
  { value: "hc-black", label: "High Contrast" },
];

export default function EditorPage() {
  const router = useRouter();
  const {
    currentFileId,
    currentFileName,
    content,
    isLoading,
    isDirty,
    updateContent,
    setDirty,
    updateFileName,
  } = useEditorStore();
  const { isOnboarded, rootFolderName, clearRootFolder } = useSettingsStore();

  // TanStack Query mutations
  const saveFileMutation = useSaveFile();
  const renameFileMutation = useRenameFile();

  const [showPreview, setShowPreview] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [editorTheme, setEditorTheme] = useState<EditorTheme>("vs-dark");
  const [fontSize, setFontSize] = useState(14);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [isRenaming, setIsRenaming] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);

  const MIN_FONT_SIZE = 10;
  const MAX_FONT_SIZE = 24;

  // 온보딩 체크 - 루트 폴더가 설정되지 않았으면 온보딩 페이지로 이동
  useEffect(() => {
    if (!isOnboarded) {
      router.replace("/onboarding");
    }
  }, [isOnboarded, router]);

  // localStorage에서 설정 불러오기
  useEffect(() => {
    const savedEditorTheme = localStorage.getItem("editorTheme") as EditorTheme;
    const savedShowPreview = localStorage.getItem("showPreview");
    const savedShowSidebar = localStorage.getItem("showSidebar");
    const savedFontSize = localStorage.getItem("editorFontSize");

    if (savedEditorTheme) setEditorTheme(savedEditorTheme);
    if (savedShowPreview !== null) setShowPreview(savedShowPreview === "true");
    if (savedShowSidebar !== null) setShowSidebar(savedShowSidebar === "true");
    if (savedFontSize) setFontSize(Number(savedFontSize));
  }, []);

  // 설정 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("editorTheme", editorTheme);
  }, [editorTheme]);

  useEffect(() => {
    localStorage.setItem("showPreview", String(showPreview));
  }, [showPreview]);

  useEffect(() => {
    localStorage.setItem("showSidebar", String(showSidebar));
  }, [showSidebar]);

  useEffect(() => {
    localStorage.setItem("editorFontSize", String(fontSize));
  }, [fontSize]);

  const decreaseFontSize = () => {
    setFontSize((prev) => Math.max(MIN_FONT_SIZE, prev - 1));
  };

  const increaseFontSize = () => {
    setFontSize((prev) => Math.min(MAX_FONT_SIZE, prev + 1));
  };

  // 이름 편집 모드 시 input focus
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [isEditingName]);

  const startEditingName = () => {
    if (currentFileName) {
      setEditName(currentFileName);
      setIsEditingName(true);
    }
  };

  const handleRename = () => {
    if (!currentFileId || !editName.trim() || editName === currentFileName) {
      setIsEditingName(false);
      return;
    }

    setIsRenaming(true);
    renameFileMutation.mutate(
      { fileId: currentFileId, newName: editName },
      {
        onSuccess: () => {
          updateFileName(editName);
          toast.success("파일 이름이 변경되었습니다.");
          setIsRenaming(false);
          setIsEditingName(false);
        },
        onError: () => {
          toast.error("이름 변경에 실패했습니다.");
          setIsRenaming(false);
          setIsEditingName(false);
        },
      }
    );
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleRename();
    } else if (e.key === "Escape") {
      setIsEditingName(false);
    }
  };

  const handleSave = useCallback(() => {
    if (!currentFileId) return;

    saveFileMutation.mutate(
      { fileId: currentFileId, content },
      {
        onSuccess: () => {
          setDirty(false);
          toast.success("파일이 저장되었습니다.");
        },
        onError: () => {
          toast.error("저장에 실패했습니다.");
        },
      }
    );
  }, [currentFileId, content, setDirty, saveFileMutation]);

  // 키보드 단축키 (Ctrl/Cmd + S)
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return (
    <div
      className="h-screen w-full bg-background text-foreground flex flex-col"
      onKeyDown={handleKeyDown}
    >
      {/* Header */}
      <header className="h-12 border-b flex items-center justify-between px-4 bg-muted/40">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowSidebar(!showSidebar)}
            title={showSidebar ? "사이드바 접기" : "사이드바 펼치기"}
            className="h-8 w-8 p-0"
          >
            {showSidebar ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeft className="w-4 h-4" />
            )}
          </Button>
          {isEditingName ? (
            <div className="flex items-center gap-2">
              <input
                ref={nameInputRef}
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={handleNameKeyDown}
                onBlur={handleRename}
                disabled={isRenaming}
                className="font-semibold text-sm bg-background border border-input rounded px-2 py-1 outline-none focus:ring-1 focus:ring-ring min-w-[200px]"
              />
              {isRenaming && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          ) : (
            <span
              className={`font-semibold text-sm ${currentFileName ? "cursor-pointer hover:text-muted-foreground" : ""}`}
              onClick={startEditingName}
            >
              {currentFileName || "파일을 선택해주세요"}
            </span>
          )}
          {isDirty && !isEditingName && (
            <span className="text-xs text-muted-foreground">(수정됨)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {rootFolderName && (
            <span className="text-xs text-muted-foreground hidden sm:inline">
              📁 {rootFolderName}
            </span>
          )}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={!currentFileId || saveFileMutation.isPending || !isDirty}
          >
            <Save className="w-4 h-4 mr-2" />
            {saveFileMutation.isPending ? "저장 중..." : "저장"}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              clearRootFolder();
              router.push("/onboarding");
            }}
            title="폴더 설정 변경"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              clearRootFolder();
              signOut({ callbackUrl: "/" });
            }}
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Main Layout */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Left Sidebar (File Tree) */}
        {showSidebar && (
          <>
            <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
              <ScrollArea className="h-full">
                <div className="p-2">
                  <FileTree />
                </div>
              </ScrollArea>
            </ResizablePanel>

            <ResizableHandle withHandle />
          </>
        )}

        {/* Right Editor + Preview */}
        <ResizablePanel defaultSize={80}>
          {isLoading ? (
            <div className="h-full p-4 space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : currentFileId ? (
            showPreview ? (
              <ResizablePanelGroup direction="horizontal" className="h-full">
                <ResizablePanel defaultSize={50}>
                  <div className="h-full flex flex-col">
                    {/* Editor Toolbar */}
                    <div className="h-8 border-b flex items-center justify-end px-2 bg-muted/20 gap-2">
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={decreaseFontSize}
                          disabled={fontSize <= MIN_FONT_SIZE}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="text-xs w-8 text-center flex items-center justify-center gap-0.5">
                          <Type className="w-3 h-3" />
                          {fontSize}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={increaseFontSize}
                          disabled={fontSize >= MAX_FONT_SIZE}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="ghost" className="h-6 px-2">
                            <Palette className="w-3 h-3 mr-1" />
                            <span className="text-xs">{editorThemes.find(t => t.value === editorTheme)?.label}</span>
                            <ChevronDown className="w-3 h-3 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {editorThemes.map((theme) => (
                            <DropdownMenuItem
                              key={theme.value}
                              onClick={() => setEditorTheme(theme.value)}
                              className={editorTheme === theme.value ? "bg-accent" : ""}
                            >
                              {theme.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowPreview(!showPreview)}
                        className="h-6 w-6 p-0"
                      >
                        <EyeOff className="w-3 h-3" />
                      </Button>
                    </div>
                    <Editor
                      height="100%"
                      defaultLanguage="markdown"
                      theme={editorTheme}
                      value={content}
                      onChange={(val) => updateContent(val || "")}
                      options={{
                        minimap: { enabled: false },
                        padding: { top: 10 },
                        fontSize,
                        wordWrap: "on",
                        lineNumbers: "on",
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                      }}
                    />
                  </div>
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={50}>
                  <MdxPreview content={content} />
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="h-full flex flex-col">
                {/* Editor Toolbar */}
                <div className="h-8 border-b flex items-center justify-end px-2 bg-muted/20 gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={decreaseFontSize}
                      disabled={fontSize <= MIN_FONT_SIZE}
                      className="h-6 w-6 p-0"
                    >
                      <Minus className="w-3 h-3" />
                    </Button>
                    <span className="text-xs w-8 text-center flex items-center justify-center gap-0.5">
                      <Type className="w-3 h-3" />
                      {fontSize}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={increaseFontSize}
                      disabled={fontSize >= MAX_FONT_SIZE}
                      className="h-6 w-6 p-0"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="ghost" className="h-6 px-2">
                        <Palette className="w-3 h-3 mr-1" />
                        <span className="text-xs">{editorThemes.find(t => t.value === editorTheme)?.label}</span>
                        <ChevronDown className="w-3 h-3 ml-1" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {editorThemes.map((theme) => (
                        <DropdownMenuItem
                          key={theme.value}
                          onClick={() => setEditorTheme(theme.value)}
                          className={editorTheme === theme.value ? "bg-accent" : ""}
                        >
                          {theme.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPreview(!showPreview)}
                    className="h-6 w-6 p-0"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                </div>
                <Editor
                  height="100%"
                  defaultLanguage="markdown"
                  theme={editorTheme}
                  value={content}
                  onChange={(val) => updateContent(val || "")}
                  options={{
                    minimap: { enabled: false },
                    padding: { top: 10 },
                    fontSize,
                    wordWrap: "on",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                  }}
                />
              </div>
            )
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-4">
              <FileWarning className="w-12 h-12" />
              <p>왼쪽에서 파일을 선택하여 편집을 시작하세요.</p>
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
