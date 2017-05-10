if (typeof mouseflow == "undefined") 
{
    var mouseflow = (function () {
        function _null() { return null; }
        return {
            start: _null,
            stop: _null,
            newPageView: _null,
            getSessionId: _null,
            getPageViewId: _null,
            tag: _null,
            star: _null,
            comment: _null,
            annotate: _null,
            debug: _null,

            baseUrl: null,
            websiteId: null,
            recordingRate: null,
            version: null,
            isRecording: false
        };
    })(window);
}