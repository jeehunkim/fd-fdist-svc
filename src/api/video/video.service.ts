import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Video } from '@entities/index';
import { ReportEntity } from '@entities/report.entity';
import { GetVideoByIdRequest, GetVideoListRequest, ReportVideoRequest, ReportVideoResponse } from '@proto/fdist.pb';

@Injectable()
export class VideoService {
  @InjectRepository(Video)
  private readonly videoRepository: Repository<Video>;

  @InjectRepository(ReportEntity)
  private readonly reportRepository: Repository<ReportEntity>;

  //constructor(private readonly videoRepository: VideoRepository) {}

  public async getVideos(payload: GetVideoListRequest): Promise<any> {
    const cat = payload.cat || 'all';
    const page = payload.page || 1;
    const limit = payload.limit || 10;

    if (cat === 'all' || cat === 'ALL' || cat === '' || cat === undefined || cat === null) {
      const [videos, total] = await this.videoRepository.findAndCount();

      return {
        result: 'ok',
        status: 200,
        message: 'success',
        data: videos,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / limit),
        },
      };
    } else {
      const queryBuilder = this.videoRepository.createQueryBuilder('video');
      const [videos, total] = await queryBuilder
        .where('video.categorySub = :cat', { cat })
        .skip((page - 1) * limit)
        .take(limit)
        .getManyAndCount();

      return {
        result: 'ok',
        status: 200,
        message: 'success',
        data: videos,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / limit),
        },
      };
    }
  }
  async getVideoById(payload: GetVideoByIdRequest): Promise<any> {
    const video = await this.videoRepository.findOne({ where: { id: payload.id } });
    video.viewCount += 1;
    await this.videoRepository.save(video);

    if (!video) {
      return {
        result: 'fail',
        status: 404,
        message: 'not found',
      };
    }

    return {
      result: 'ok',
      status: 200,
      message: 'success',
      data: video,
    };
  }

  async reportVideo(payload: ReportVideoRequest): Promise<ReportVideoResponse> {
    const report = new ReportEntity();
    report.userId = payload.userId;
    report.videoId = payload.videoId;
    report.reportType = payload.reportType;
    report.report = payload.report;

    await this.reportRepository.save(report);

    const video = await this.videoRepository.findOne({ where: { id: payload.videoId } });
    video.reportCount += 1;
    await this.videoRepository.save(video);

    return {
      result: 'ok',
      status: 200,
      message: 'success',
      data: [
        {
          result: true,
        },
      ],
    };
  }
}
