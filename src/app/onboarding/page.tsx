"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Folder, FolderPlus, Check, LogOut } from "lucide-react";
import { useSettingsStore } from "@/store/useSettingsStore";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import Footer from "@/components/Footer";
import { useRootFolders, useCreateCmsFolder } from "@/hooks/useApi";

export default function OnboardingPage() {
  const router = useRouter();
  const { setRootFolder, isOnboarded, clearRootFolder } = useSettingsStore();
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // TanStack Query hooks
  const {
    data: folders = [],
    isLoading,
    error,
  } = useRootFolders();

  const createCmsFolderMutation = useCreateCmsFolder();

  // 이미 온보딩이 완료된 경우 에디터로 리다이렉트
  useEffect(() => {
    if (isOnboarded) {
      router.replace("/editor");
    }
  }, [isOnboarded, router]);

  // 자동으로 CMS 폴더 생성
  const handleAutoCreate = async () => {
    createCmsFolderMutation.mutate(undefined, {
      onSuccess: (folder) => {
        setRootFolder(folder.id, folder.name);
        toast.success("CMS 폴더가 생성되었습니다.");
        router.push("/editor");
      },
      onError: () => {
        toast.error("폴더 생성에 실패했습니다.");
      },
    });
  };

  // 기존 폴더 선택
  const handleSelectFolder = (folderId: string) => {
    setSelectedFolder(folderId);
  };

  // 선택한 폴더로 설정
  const handleConfirmFolder = () => {
    const folder = folders.find((f) => f.id === selectedFolder);
    if (folder) {
      setRootFolder(folder.id, folder.name);
      toast.success("폴더가 설정되었습니다.");
      router.push("/editor");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                clearRootFolder();
                signOut({ callbackUrl: "/" });
              }}
              className="absolute right-4 top-0"
            >
              <LogOut className="w-4 h-4 mr-1" />
            </Button>
            <CardTitle className="text-2xl">CMS 설정</CardTitle>
            <CardDescription>
              MDX 파일을 저장할 Google Drive 폴더를 선택하세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="text-destructive text-sm text-center">
                폴더 목록을 불러오는데 실패했습니다.
              </div>
            )}

            {/* 자동 생성 옵션 */}
            <div className="space-y-2">
              <Button
                onClick={handleAutoCreate}
                disabled={createCmsFolderMutation.isPending}
                className="w-full"
                size="lg"
              >
                {createCmsFolderMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <FolderPlus className="w-4 h-4 mr-2" />
                )}
                My-CMS-Folder 폴더 자동 생성
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                Google Drive에 새 폴더를 만들어 시작합니다 (권장)
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  또는 기존 폴더 선택
                </span>
              </div>
            </div>

            {/* 기존 폴더 목록 */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {folders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Google Drive 루트에 폴더가 없습니다
                </p>
              ) : (
                folders.map((folder) => (
                  <div
                    key={folder.id}
                    onClick={() => handleSelectFolder(folder.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedFolder === folder.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:bg-muted/50"
                    }`}
                  >
                    <Folder className="w-5 h-5 text-blue-400" />
                    <span className="flex-1 text-sm">{folder.name}</span>
                    {selectedFolder === folder.id && (
                      <Check className="w-4 h-4 text-primary" />
                    )}
                  </div>
                ))
              )}
            </div>

            {selectedFolder && (
              <Button
                onClick={handleConfirmFolder}
                variant="outline"
                className="w-full"
              >
                선택한 폴더 사용
              </Button>
            )}

            <p className="text-xs text-muted-foreground text-center">
              선택한 폴더 내의 MDX/MD 파일만 편집할 수 있습니다.
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
