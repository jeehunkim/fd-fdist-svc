import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { VideoService } from './video.service';
import {
  F_DIST_SERVICE_NAME,
  GetVideoByIdRequest,
  GetVideoListRequest, TogglePublishedRequest,
  TogglePublishedResponse,
  addTmpVideoRequest,
  VideoUploadRequest,
  VIDEO_SERVICE_NAME,
} from '@proto/fdist.pb';


@Controller()
export class VideoController {
  @Inject(VideoService)
  private readonly service: VideoService;

  @GrpcMethod(F_DIST_SERVICE_NAME, 'getVideos')
  private getVideos(payload: GetVideoListRequest): Promise<any> {
    return this.service.getVideos(payload);
  }

  @GrpcMethod(F_DIST_SERVICE_NAME, 'getVideoById')
  private getVideoById(payload: GetVideoByIdRequest): Promise<any> {
    return this.service.getVideoById(payload);
  }

  @GrpcMethod(F_DIST_SERVICE_NAME, 'reportVideo')
  private reportVideo(payload: any): Promise<any> {
    return this.service.reportVideo(payload);
  }

  @GrpcMethod(F_DIST_SERVICE_NAME, 'getVideoRecordType')
  private getVideoRecordType(payload: any): Promise<any> {
    return this.service.getVideoRecordType(payload);
  }

  @GrpcMethod(F_DIST_SERVICE_NAME, 'myVideoList')
  private myVideoList(payload: any): Promise<any> {
    return this.service.myVideoList(payload);
  }

  @GrpcMethod(F_DIST_SERVICE_NAME, 'myVideoExists')
  private myVideoExists(payload: any): Promise<any> {
    return this.service.myVideoExists(payload);
  }

  @GrpcMethod(VIDEO_SERVICE_NAME, 'deleteVideo')
  private deleteVideo(payload: any): Promise<any> {
    return this.service.deleteVideo(payload);
  }

  @GrpcMethod(VIDEO_SERVICE_NAME, 'togglePublished')
  private togglePublished(payload: TogglePublishedRequest): Promise<TogglePublishedResponse> {
    return this.service.togglePublished(payload);
  }

  @GrpcMethod(VIDEO_SERVICE_NAME, 'shootingVideo')
  private shootingVideo(payload: addTmpVideoRequest): Promise<any> {
    return this.service.addTmpVideo(payload);
  }

  @GrpcMethod(VIDEO_SERVICE_NAME, 'videoUpload')
  private videoUpload(payload: any): Promise<any> {
    return this.service.videoUpload(payload);
  }

  @GrpcMethod(VIDEO_SERVICE_NAME, 'ivpCallback')
  private ivpCallback(payload: any): Promise<any> {
    return this.service.ivpCallback(payload);
  }
}
