/**
 * Created by ozknemoy on 26.05.2017.
 */
declare var $: any;

export class JqService {

    //initMessagesState
    initMessagesState() {
        setTimeout(()=>this.mh(),300);
        $(window).resize(this.mh)
    }

    mh (){
        var id = '.chat_block--wrapper, .chat_block--ulist, .chat_block--wrap';
        var wh = $(window).height(),
            ww = $(window).width(),
            nh = $('.inner_top').height(),
            fh = $('.footer.footer-color-dark').height();
        return (ww > 767)? $(id).height(wh-nh-fh-60) :  $(id).height(wh-nh)
    }

    addClassInMessages() {
        if($(window).width()<=767) {
            $('.chat_block--wrapper').addClass('open-message');
        }
    }

    deleteClassInMessages() {
        $('.chat_block--wrapper').removeClass('open-message');
    }

    destroyMessagesState() {
        $(window).off('resize',this.mh)
    }


    //end initMessagesState
}