import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DriveFile } from "@/lib/schema";

// Query Keys
export const queryKeys = {
  files: (folderId: string) => ["files", folderId] as const,
  fileContent: (fileId: string) => ["fileContent", fileId] as const,
  rootFolders: ["rootFolders"] as const,
};

// API Functions
async function fetchFiles(folderId: string): Promise<DriveFile[]> {
  const res = await fetch(`/api/files?folderId=${folderId}`);
  if (!res.ok) throw new Error("Failed to load files");
  const data = await res.json();
  return (data.files || []).filter((file: DriveFile) => {
    const isFolder = file.mimeType === "application/vnd.google-apps.folder";
    const isMarkdown = file.name.endsWith(".mdx") || file.name.endsWith(".md");
    return isFolder || isMarkdown;
  });
}

async function fetchFileContent(fileId: string): Promise<string> {
  const res = await fetch(`/api/read?fileId=${fileId}`);
  if (!res.ok) throw new Error("Failed to read file");
  return res.text();
}

async function fetchRootFolders(): Promise<DriveFile[]> {
  const res = await fetch("/api/setup-folder");
  if (!res.ok) throw new Error("Failed to load folders");
  const data = await res.json();
  return data.folders || [];
}

async function createCmsFolder(): Promise<DriveFile> {
  const res = await fetch("/api/setup-folder?action=auto");
  if (!res.ok) throw new Error("Failed to create folder");
  const data = await res.json();
  return data.folder;
}

async function saveFile({
  fileId,
  content,
}: {
  fileId: string;
  content: string;
}): Promise<void> {
  const res = await fetch("/api/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, content }),
  });
  if (!res.ok) throw new Error("Failed to save file");
}

async function createFile({
  name,
  parentId,
}: {
  name: string;
  parentId: string;
}): Promise<DriveFile> {
  const res = await fetch("/api/create-file", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });
  if (!res.ok) throw new Error("Failed to create file");
  const data = await res.json();
  return data.file;
}

async function createFolder({
  name,
  parentId,
}: {
  name: string;
  parentId: string;
}): Promise<DriveFile> {
  const res = await fetch("/api/create-folder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, parentId }),
  });
  if (!res.ok) throw new Error("Failed to create folder");
  const data = await res.json();
  return data.folder;
}

async function deleteFile(fileId: string): Promise<void> {
  const res = await fetch("/api/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId }),
  });
  if (!res.ok) throw new Error("Failed to delete");
}

async function renameFile({
  fileId,
  newName,
}: {
  fileId: string;
  newName: string;
}): Promise<DriveFile> {
  const res = await fetch("/api/rename", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ fileId, newName }),
  });
  if (!res.ok) throw new Error("Failed to rename");
  const data = await res.json();
  return data.file;
}

// Hooks
export function useFiles(folderId: string | null) {
  return useQuery({
    queryKey: queryKeys.files(folderId || ""),
    queryFn: () => fetchFiles(folderId!),
    enabled: !!folderId,
  });
}

export function useFileContent(fileId: string | null) {
  return useQuery({
    queryKey: queryKeys.fileContent(fileId || ""),
    queryFn: () => fetchFileContent(fileId!),
    enabled: !!fileId,
  });
}

export function useRootFolders() {
  return useQuery({
    queryKey: queryKeys.rootFolders,
    queryFn: fetchRootFolders,
  });
}

export function useCreateCmsFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCmsFolder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rootFolders });
    },
  });
}

export function useSaveFile() {
  return useMutation({
    mutationFn: saveFile,
  });
}

export function useCreateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFile,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.files(variables.parentId),
      });
    },
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createFolder,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.files(variables.parentId),
      });
    },
  });
}

export function useDeleteFile(parentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteFile,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.files(parentId),
      });
    },
  });
}

export function useRenameFile() {
  return useMutation({
    mutationFn: renameFile,
  });
}
