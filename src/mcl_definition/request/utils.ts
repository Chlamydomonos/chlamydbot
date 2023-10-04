import type { Group } from '../event/utils';

export type Code = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 10 | 20 | 30 | 400;

export interface Profile {
    nickname: string;
    email: string;
    age: string;
    level: number;
    sign: string;
    sex: 'UNKNOWN' | 'MALE' | 'FEMALE';
}

export interface FileInfo {
    name: string;
    id: string;
    path: string;
    parent?: FileInfo;
    contact: Group;
    isFile: boolean;
    isDictionary: boolean;
    isDirectory: boolean;
    sha1: string;
    md5: string;
    downloadTimes: number;
    uploaderId: number;
    uploadTime: number;
    lastModifyTime: number;
    downloadInfo: {
        sha1: string;
        md5: string;
        downloadTimes: number;
        uploaderId: number;
        uploadTime: number;
        lastModifyTime: number;
        url: string;
    };
}

export interface GroupConfig {
    name: string;
    announcement: string;
    confessTalk: boolean;
    allowMemberInvite: boolean;
    autoApprove: boolean;
    anonymousChat: boolean;
}

export interface Anno {
    group: Group;
    content: string;
    senderId: number;
    fid: string;
    allConfirmed: boolean;
    confirmedMembersCount: number;
    publicationTime: number;
}
