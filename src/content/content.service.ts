import {fetchPageContent} from "../browser/browser";
import * as cheerio from "cheerio";
import download from "download";
import youtubeDl from "youtube-dl-exec";

interface IGetVideoResult {
    success: boolean
    file: Buffer | null
    message: string | null
}

export class ContentService {
    static async getFileFromInstagram (url: string) {
        let result: IGetVideoResult = {
            success: true,
            file: null,
            message: null
        };

        let siteContent;
        try {
            siteContent = await fetchPageContent(url);
        } catch (e) {
            result.success = false
            result.message = 'При открытии ссылки с видео:\n ``` ' + JSON.stringify(e) + '```';
            return result;
        }

        const $ = cheerio.load(siteContent, {});
        let urlVideo;
        const $video = $('video');
        if(!$video.length) {
            result.success = false
            result.message = 'При скачивании видео произошла ошибка:\n ``` Не удалось скачать видео ```'
            return result;
        }

        urlVideo = $video.attr('src');
        if(urlVideo) {
            result.file = await download(urlVideo)
            return result
        } else {
            result.success = false
            result.message = 'При скачивании видео произошла ошибка:\n ```Не удалось обнаружить ссылку на видео```'
            return result
        }
    }

    static async getFileFromYouTube (url: string) {
        let result: IGetVideoResult = {
            success: true,
            file: null,
            message: null
        };

        try {
            const video = await youtubeDl(url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot'],
                format: 'mp4'
            })
            // @ts-ignore
            if(video.requested_downloads[0].url) {
                // @ts-ignore
                result.file = await download(video.requested_downloads[0].url);
            }
        } catch (e) {
            const errorMessage = JSON.stringify(e) ?? 'Не удалось получить ошибку'
            result.success = false
            result.message = 'При скачивании видео с youtube произошел отвал: ``` ' + errorMessage + ' ```';
        }

        return result;
    }

    static async getVideoFileByUrl(url: string) {
        let result: IGetVideoResult = {
            success: true,
            file: null,
            message: null
        };

        if(url && url.indexOf('http') === 0) {
            if(url.indexOf('instagram') !== -1) {
                result = await this.getFileFromInstagram(url)
            } else if(url.indexOf('youtube') !== -1) {
                result = await this.getFileFromYouTube(url)
            }
        }

        return result
    }
}