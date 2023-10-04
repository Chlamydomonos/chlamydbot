import type { Group } from '../event/utils';
import type { ReqResBase, ResponseBase, SessionReqBase } from './base';
import type { FileInfo as $FileInfo } from './utils';

export interface FileListReq extends SessionReqBase {
    id: string;
    path?: string;
    target?: number;
    group?: number;
    qq?: number;
    withDownloadInfo?: boolean;
    offset?: number;
    size?: number;
}

export interface FileListRes extends ResponseBase {
    data: $FileInfo[];
}

export interface FileList extends ReqResBase<FileListReq, FileListRes> {}

export interface FileInfoReq extends SessionReqBase {
    id: string;
    path?: string;
    target?: number;
    group?: number;
    qq?: number;
    withDownloadInfo?: boolean;
}

export interface FileInfoRes extends ResponseBase {
    data: $FileInfo;
}

export interface FileInfo extends ReqResBase<FileInfoReq, FileInfoRes> {}

export interface FileMkdirReq extends SessionReqBase {
    id: string;
    path?: string;
    target?: number;
    group?: number;
    qq?: number;
    directoryName: string;
}

export interface FileMkdirRes extends ResponseBase {
    data: {
        name: string;
        id: string;
        path: string;
        parent?: $FileInfo;
        contact: Group;
        isFile: boolean;
        isDictionary: boolean;
        isDirectory: boolean;
    };
}

export interface FileMkdir extends ReqResBase<FileMkdirReq, FileMkdirRes> {}

export interface FileDeleteReq extends SessionReqBase {
    id: string;
    path?: string;
    target?: number;
    group?: number;
    qq?: number;
}

export interface FileDelete extends ReqResBase<FileDeleteReq, ResponseBase> {}

export interface FileMoveReq extends SessionReqBase {
    id: string;
    path: string;
    target?: number;
    group?: number;
    qq?: number;
    moveTo?: string;
    moveToPath?: string;
}

export interface FileMove extends ReqResBase<FileMoveReq, ResponseBase> {}

export interface FileRenameReq extends SessionReqBase {
    id: string;
    path: string;
    target?: number;
    group?: number;
    qq?: number;
    renameTo: string;
}

export interface FileRename extends ReqResBase<FileRenameReq, ResponseBase> {}

export interface UploadImageReq extends SessionReqBase {
    type: 'friend' | 'group' | 'temp';
    img: File;
}

export interface UploadImageRes {
    imageId: string;
    url: string;
}

export interface UploadImage
    extends ReqResBase<UploadImageReq, UploadImageRes> {
    isFormData: true;
}

export interface UploadVoiceReq extends SessionReqBase {
    type: 'friend' | 'group' | 'temp';
    img: File;
}

export interface UploadVoiceRes {
    voiceId: string;
    url: string;
}

export interface UploadVoice
    extends ReqResBase<UploadVoiceReq, UploadVoiceRes> {
    isFormData: true;
}

export interface FileUploadReq extends SessionReqBase {
    type: 'group';
    target: number;
    path: string;
    file: File;
}

export interface FileUploadRes {
    name: string;
    id: string;
    path: string;
    parent?: $FileInfo;
    contact: Group;
    isFile: boolean;
    isDictionary: boolean;
    isDirectory: boolean;
}

export interface FileUpload extends ReqResBase<FileUploadReq, FileUploadRes> {
    isFormData: true;
}
