/**
 * Created by ozknemoy on 13.04.2017.
 */
import { Component } from '@angular/core';
import { HttpService } from '../../../modules/transfer-http/transfer-http';
import {AutoUnsubscribe} from "../../../services/@AutoUnsubscribe.decorator";
import {HandleData} from "../../../services/handle-data.service";

export interface IDictUrlCaption {
    url: string,
    caption: string,
    _thumbUrl: string
}

@Component({
    selector: 'biz-edu-view',
    templateUrl: 'biz-edu-view.html'
})
@AutoUnsubscribe()
export class BizEduView {
    public videos:IDictUrlCaption[];

    constructor(public httpService:HttpService, public handleData:HandleData) {}

    ngOnInit() {
        this.httpService.getUnlimCache('lessons/video').subscribe((d:IDictUrlCaption[])=> {
            this.videos = d.map( (video:IDictUrlCaption)=> {
                Object.assign(video,this.handleData.getYoutubeVideoObj(video.url));
                return video
            })
        })
    }
}