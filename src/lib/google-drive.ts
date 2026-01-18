import { google } from "googleapis";
import { DriveFile } from "./schema";

// Google Drive 클라이언트 생성
function createDriveClient(accessToken: string) {
  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: accessToken });

  return google.drive({ version: "v3", auth });
}

// 파일 목록 가져오기
export async function listFiles(
  folderId: string,
  accessToken: string,
): Promise<DriveFile[]> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.list({
    q: `'${folderId}' in parents and trashed = false`,
    fields: "files(id, name, mimeType, modifiedTime, size)",
    orderBy: "folder,name",
    pageSize: 100,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  });

  return (response.data.files || []) as DriveFile[];
}

// 공유 드라이브 목록 가져오기
export async function listSharedDrives(
  accessToken: string,
): Promise<DriveFile[]> {
  const drive = createDriveClient(accessToken);

  const response = await drive.drives.list({
    pageSize: 100,
    fields: "drives(id, name)",
  });

  return (response.data.drives || []).map((d) => ({
    id: d.id!,
    name: d.name!,
    mimeType: "application/vnd.google-apps.folder",
  })) as DriveFile[];
}

// 파일 내용 읽기
export async function getFileContent(
  fileId: string,
  accessToken: string,
): Promise<string> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.get(
    {
      fileId,
      alt: "media",
      supportsAllDrives: true,
    },
    {
      responseType: "text",
    },
  );

  return response.data as string;
}

// 파일 내용 업데이트
export async function updateFileContent(
  fileId: string,
  content: string,
  accessToken: string,
): Promise<void> {
  const drive = createDriveClient(accessToken);

  await drive.files.update({
    fileId,
    supportsAllDrives: true,
    media: {
      mimeType: "text/plain",
      body: content,
    },
  });
}

// 파일 메타데이터 가져오기
export async function getFileMetadata(
  fileId: string,
  accessToken: string,
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.get({
    fileId,
    fields: "id, name, mimeType, modifiedTime, size",
    supportsAllDrives: true,
  });

  return response.data as DriveFile;
}

// 파일 이름 변경
export async function renameFile(
  fileId: string,
  newName: string,
  accessToken: string,
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.update({
    fileId,
    supportsAllDrives: true,
    requestBody: {
      name: newName,
    },
    fields: "id, name, mimeType, modifiedTime, size",
  });

  return response.data as DriveFile;
}

// 파일 생성
export async function createFile(
  name: string,
  parentId: string,
  content: string,
  accessToken: string,
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name,
      parents: [parentId],
      mimeType: "text/plain",
    },
    media: {
      mimeType: "text/plain",
      body: content,
    },
    fields: "id, name, mimeType, modifiedTime, size",
  });

  return response.data as DriveFile;
}

// 폴더 생성
export async function createFolder(
  name: string,
  parentId: string,
  accessToken: string,
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name,
      parents: [parentId],
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id, name, mimeType, modifiedTime, size",
  });

  return response.data as DriveFile;
}

// 파일/폴더 삭제
export async function deleteFile(
  fileId: string,
  accessToken: string,
): Promise<void> {
  const drive = createDriveClient(accessToken);

  await drive.files.delete({
    fileId,
    supportsAllDrives: true,
  });
}

// CMS 루트 폴더명
const CMS_ROOT_FOLDER_NAME = "My-CMS-Folder";

// 사용자 드라이브의 루트 폴더 목록 가져오기
export async function listRootFolders(
  accessToken: string,
): Promise<DriveFile[]> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.list({
    q: "'root' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
    fields: "files(id, name, mimeType, modifiedTime)",
    orderBy: "name",
    pageSize: 100,
  });

  return (response.data.files || []) as DriveFile[];
}

// CMS 루트 폴더 찾기
export async function findCmsRootFolder(
  accessToken: string,
): Promise<DriveFile | null> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.list({
    q: `name = '${CMS_ROOT_FOLDER_NAME}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false and 'root' in parents`,
    fields: "files(id, name, mimeType, modifiedTime)",
    pageSize: 1,
  });

  const files = response.data.files || [];
  return files.length > 0 ? (files[0] as DriveFile) : null;
}

// CMS 루트 폴더 생성
export async function createCmsRootFolder(
  accessToken: string,
): Promise<DriveFile> {
  const drive = createDriveClient(accessToken);

  const response = await drive.files.create({
    requestBody: {
      name: CMS_ROOT_FOLDER_NAME,
      mimeType: "application/vnd.google-apps.folder",
    },
    fields: "id, name, mimeType, modifiedTime",
  });

  return response.data as DriveFile;
}

// CMS 루트 폴더 찾거나 생성
export async function getOrCreateCmsRootFolder(
  accessToken: string,
): Promise<DriveFile> {
  const existing = await findCmsRootFolder(accessToken);
  if (existing) {
    return existing;
  }
  return createCmsRootFolder(accessToken);
}
