/*
 * FancyBox - jQuery Plugin
 * Simple and fancy lightbox alternative
 *
 * Examples and documentation at: http://fancybox.net
 * Credit goes to jquery.fancybox.js
 * Copyright (c) 2008 - 2010 Janis Skarnelis
 * That said, it is hardly a one-person project. Many people have submitted bugs, code, and offered their advice freely. Their support is greatly appreciated.
 *
 * Version: 1.3.4 (11/11/2010)
 * Requires: jQuery v1.3+
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */

		try{
			var _cookiepolicyfancybox = jQuery;                     
		}catch(e){
		try{
			var _cookiepolicyfancybox = $;                         
		}catch(e){
			}
		}      
		// resolve jQuery conflict
		_cookiepolicyfancybox = _cookiepolicyfancybox.noConflict();
		
		//alert('_cookiepolicyfancybox :'+_cookiepolicyfancybox);
;(function(_cookiepolicyfancybox) {
        var tmp, loading, overlay, wrap, outer, content, close, title, nav_left, nav_right,

                selectedIndex = 0, selectedOpts = {}, selectedArray = [], currentIndex = 0, currentOpts = {}, currentArray = [],

                ajaxLoader = null, imgPreloader = new Image(), imgRegExp = /\.(jpg|gif|png|bmp|jpeg)(.*)?$/i, swfRegExp = /[^\.]\.(swf)\s*$/i,

                loadingTimer, loadingFrame = 1,

                titleHeight = 0, titleStr = '', start_pos, final_pos, busy = false, fx = _cookiepolicyfancybox.extend(_cookiepolicyfancybox('<div/>')[0], { prop: 0 }),

                isIE6 = _cookiepolicyfancybox.browser.msie && _cookiepolicyfancybox.browser.version < 7 && !window.XMLHttpRequest,

                /*
                 * Private methods 
                 */

                _abort = function() {
                        loading.hide();

                        imgPreloader.onerror = imgPreloader.onload = null;

                        if (ajaxLoader) {
                                ajaxLoader.abort();
                        }

                        tmp.empty();
                },

                _error = function() {
                        if (false === selectedOpts.onError(selectedArray, selectedIndex, selectedOpts)) {
                                loading.hide();
                                busy = false;
                                return;
                        }

                        selectedOpts.titleShow = false;

                        selectedOpts.width = 'auto';
                        selectedOpts.height = 'auto';

                        tmp.html( '<p id="oupcookiepolicy_fancybox-error">The requested content cannot be loaded.<br />Please try again later.</p>' );

                        _process_inline();
                },

                _start = function() {
                        var obj = selectedArray[ selectedIndex ],
                                href, 
                                type, 
                                title,
                                str,
                                emb,
                                ret;

                        _abort();

                        selectedOpts = _cookiepolicyfancybox.extend({}, _cookiepolicyfancybox.fn.oupcookiepolicy_fancybox.defaults, (typeof _cookiepolicyfancybox(obj).data('oupcookiepolicy_fancybox') == 'undefined' ? selectedOpts : _cookiepolicyfancybox(obj).data('oupcookiepolicy_fancybox')));

                        ret = selectedOpts.onStart(selectedArray, selectedIndex, selectedOpts);

                        if (ret === false) {
                                busy = false;
                                return;
                        } else if (typeof ret == 'object') {
                                selectedOpts = _cookiepolicyfancybox.extend(selectedOpts, ret);
                        }

                        title = selectedOpts.title || (obj.nodeName ? _cookiepolicyfancybox(obj).attr('title') : obj.title) || '';

                        if (obj.nodeName && !selectedOpts.orig) {
                                selectedOpts.orig = _cookiepolicyfancybox(obj).children("img:first").length ? _cookiepolicyfancybox(obj).children("img:first") : _cookiepolicyfancybox(obj);
                        }

                        if (title === '' && selectedOpts.orig && selectedOpts.titleFromAlt) {
                                title = selectedOpts.orig.attr('alt');
                        }

                        href = selectedOpts.href || (obj.nodeName ? _cookiepolicyfancybox(obj).attr('href') : obj.href) || null;

                        if ((/^(?:javascript)/i).test(href) || href == '#') {
                                href = null;
                        }

                        if (selectedOpts.type) {
                                type = selectedOpts.type;

                                if (!href) {
                                        href = selectedOpts.content;
                                }

                        } else if (selectedOpts.content) {
                                type = 'html';

                        } else if (href) {
                                if (href.match(imgRegExp)) {
                                        type = 'image';

                                } else if (href.match(swfRegExp)) {
                                        type = 'swf';

                                } else if (_cookiepolicyfancybox(obj).hasClass("iframe")) {
                                        type = 'iframe';

                                } else if (href.indexOf("#") === 0) {
                                        type = 'inline';

                                } else {
                                        type = 'ajax';
                                }
                        }

                        if (!type) {
                                _error();
                                return;
                        }

                        if (type == 'inline') {
                                obj     = href.substr(href.indexOf("#"));
                                type = _cookiepolicyfancybox(obj).length > 0 ? 'inline' : 'ajax';
                        }

                        selectedOpts.type = type;
                        selectedOpts.href = href;
                        selectedOpts.title = title;

                        if (selectedOpts.autoDimensions) {
                                if (selectedOpts.type == 'html' || selectedOpts.type == 'inline' || selectedOpts.type == 'ajax') {
                                        selectedOpts.width = 'auto';
                                        selectedOpts.height = 'auto';
                                } else {
                                        selectedOpts.autoDimensions = false;    
                                }
                        }

                        if (selectedOpts.modal) {
                                selectedOpts.overlayShow = true;
                                selectedOpts.hideOnOverlayClick = false;
                                selectedOpts.hideOnContentClick = false;
                                selectedOpts.enableEscapeButton = false;
                                selectedOpts.showCloseButton = false;
                        }

                        selectedOpts.padding = parseInt(selectedOpts.padding, 10);
                        selectedOpts.margin = parseInt(selectedOpts.margin, 10);

                        tmp.css('padding', (selectedOpts.padding + selectedOpts.margin));

                        _cookiepolicyfancybox('.oupcookiepolicy_fancybox-inline-tmp').unbind('oupcookiepolicy_fancybox-cancel').bind('oupcookiepolicy_fancybox-change', function() {
                                _cookiepolicyfancybox(this).replaceWith(content.children());                                
                        });

                        switch (type) {
                                case 'html' :
                                        tmp.html( selectedOpts.content );
                                        _process_inline();
                                break;

                                case 'inline' :
                                        if ( _cookiepolicyfancybox(obj).parent().is('#oupcookiepolicy_fancybox-content') === true) {
                                                busy = false;
                                                return;
                                        }

                                        _cookiepolicyfancybox('<div class="oupcookiepolicy_fancybox-inline-tmp" />')
                                                .hide()
                                                .insertBefore( _cookiepolicyfancybox(obj) )
                                                .bind('oupcookiepolicy_fancybox-cleanup', function() {
                                                        _cookiepolicyfancybox(this).replaceWith(content.children());
                                                }).bind('oupcookiepolicy_fancybox-cancel', function() {
                                                        _cookiepolicyfancybox(this).replaceWith(tmp.children());
                                                });

                                        _cookiepolicyfancybox(obj).appendTo(tmp);

                                        _process_inline();
                                break;

                                case 'image':
                                        busy = false;

                                        _cookiepolicyfancybox.oupcookiepolicy_fancybox.showActivity();

                                        imgPreloader = new Image();

                                        imgPreloader.onerror = function() {
                                                _error();
                                        };

                                        imgPreloader.onload = function() {
                                                busy = true;

                                                imgPreloader.onerror = imgPreloader.onload = null;

                                                _process_image();
                                        };

                                        imgPreloader.src = href;
                                break;

                                case 'swf':
                                        selectedOpts.scrolling = 'no';

                                        str = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"><param name="movie" value="' + href + '"></param>';
                                        emb = '';

                                        _cookiepolicyfancybox.each(selectedOpts.swf, function(name, val) {
                                                str += '<param name="' + name + '" value="' + val + '"></param>';
                                                emb += ' ' + name + '="' + val + '"';
                                        });

                                        str += '<embed src="' + href + '" type="application/x-shockwave-flash" width="' + selectedOpts.width + '" height="' + selectedOpts.height + '"' + emb + '></embed></object>';

                                        tmp.html(str);

                                        _process_inline();
                                break;

                                case 'ajax':
                                        busy = false;

                                        _cookiepolicyfancybox.oupcookiepolicy_fancybox.showActivity();

                                        selectedOpts.ajax.win = selectedOpts.ajax.success;

                                        ajaxLoader = _cookiepolicyfancybox.ajax(_cookiepolicyfancybox.extend({}, selectedOpts.ajax, {
                                                url     : href,
                                                data : selectedOpts.ajax.data || {},
                                                error : function(XMLHttpRequest, textStatus, errorThrown) {
                                                        if ( XMLHttpRequest.status > 0 ) {
                                                                _error();
                                                        }
                                                },
                                                success : function(data, textStatus, XMLHttpRequest) {
                                                        var o = typeof XMLHttpRequest == 'object' ? XMLHttpRequest : ajaxLoader;
                                                        if (o.status == 200) {
                                                                if ( typeof selectedOpts.ajax.win == 'function' ) {
                                                                        ret = selectedOpts.ajax.win(href, data, textStatus, XMLHttpRequest);

                                                                        if (ret === false) {
                                                                                loading.hide();
                                                                                return;
                                                                        } else if (typeof ret == 'string' || typeof ret == 'object') {
                                                                                data = ret;
                                                                        }
                                                                }

                                                                tmp.html( data );
                                                                _process_inline();
                                                        }
                                                }
                                        }));

                                break;

                                case 'iframe':
                                        _show();
                                break;
                        }
                },

                _process_inline = function() {
                        var
                                w = selectedOpts.width,
                                h = selectedOpts.height;

                        if (w.toString().indexOf('%') > -1) {
                                w = parseInt( (_cookiepolicyfancybox(window).width() - (selectedOpts.margin * 2)) * parseFloat(w) / 100, 10) + 'px';

                        } else {
                                w = w == 'auto' ? 'auto' : w + 'px';    
                        }

                        if (h.toString().indexOf('%') > -1) {
                                h = parseInt( (_cookiepolicyfancybox(window).height() - (selectedOpts.margin * 2)) * parseFloat(h) / 100, 10) + 'px';

                        } else {
                                h = h == 'auto' ? 'auto' : h + 'px';    
                        }

                        tmp.wrapInner('<div style="width:' + w + ';height:' + h + ';overflow: ' + (selectedOpts.scrolling == 'auto' ? 'auto' : (selectedOpts.scrolling == 'yes' ? 'scroll' : 'hidden')) + ';position:relative;"></div>');

                        selectedOpts.width = tmp.width();
                        selectedOpts.height = tmp.height();

                        _show();
                },

                _process_image = function() {
                        selectedOpts.width = imgPreloader.width;
                        selectedOpts.height = imgPreloader.height;

                        _cookiepolicyfancybox("<img />").attr({
                                'id' : 'oupcookiepolicy_fancybox-img',
                                'src' : imgPreloader.src,
                                'alt' : selectedOpts.title
                        }).appendTo( tmp );

                        _show();
                },

                _show = function() {
                        var pos, equal;

                        loading.hide();

			//alert('currentOpts.onCleanup :'+currentOpts.onCleanup);
                      if (wrap.is(":visible") && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
                                _cookiepolicyfancybox.event.trigger('oupcookiepolicy_fancybox-cancel');

                                busy = false;
                                return;
                        }

                        busy = true;

                        _cookiepolicyfancybox(content.add( overlay )).unbind();

                        _cookiepolicyfancybox(window).unbind("resize.fb scroll.fb");
                        _cookiepolicyfancybox(document).unbind('keydown.fb');

                        currentArray = selectedArray;
                        currentIndex = selectedIndex;
                        currentOpts = selectedOpts;

                        if (wrap.is(":visible") && currentOpts.titlePosition !== 'outside') {
                                wrap.css('height', wrap.height());
                        }


                        if (currentOpts.overlayShow) {
                                overlay.css({
                                        'background-color' : currentOpts.overlayColor,
                                        'opacity' : currentOpts.overlayOpacity,
                                        'cursor' : currentOpts.hideOnOverlayClick ? 'pointer' : 'auto',
                                        'height' : _cookiepolicyfancybox(document).height()
                                });

                                if (!overlay.is(':visible')) {
                                        if (isIE6) {
                                                _cookiepolicyfancybox('select:not(#oupcookiepolicy_fancybox-tmp select)').filter(function() {
                                                        return this.style.visibility !== 'hidden';
                                                }).css({'visibility' : 'hidden'}).one('oupcookiepolicy_fancybox-cleanup', function() {
                                                        this.style.visibility = 'inherit';
                                                });
                                        }

                                        overlay.show();
                                }
                        } else {
                                overlay.hide();
                        }

                        final_pos = _get_zoom_to();

                        _process_title();

                        if (wrap.is(":visible")) {
                                _cookiepolicyfancybox( close.add( nav_left ).add( nav_right ) ).hide();

                                pos = wrap.position(),

                                start_pos = {
                                        top      : pos.top,
                                        left : pos.left,
                                        width : wrap.width(),
                                        height : wrap.height()
                                };

                                equal = (start_pos.width == final_pos.width && start_pos.height == final_pos.height);

                                content.fadeTo(currentOpts.changeFade, 0.3, function() {
                                        var finish_resizing = function() {
                                                content.html( tmp.contents() ).fadeTo(currentOpts.changeFade, 1, _finish);
                                        };

                                        _cookiepolicyfancybox.event.trigger('oupcookiepolicy_fancybox-change');

                                        content
                                                .empty()
                                                .removeAttr('filter')
                                                .css({
                                                        'border-width' : currentOpts.padding,
                                                        'width' : final_pos.width - currentOpts.padding * 2,
                                                        'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
                                                });

                                        if (equal) {
                                                finish_resizing();

                                        } else {
                                                fx.prop = 0;

                                                _cookiepolicyfancybox(fx).animate({prop: 1}, {
                                                         duration : currentOpts.changeSpeed,
                                                         easing : currentOpts.easingChange,
                                                         step : _draw,
                                                         complete : finish_resizing
                                                });
                                        }
                                });

                                return;
                        }

                        wrap.removeAttr("style");

                        content.css('border-width', currentOpts.padding);

                        if (currentOpts.transitionIn == 'elastic') {
                                start_pos = _get_zoom_from();

                                content.html( tmp.contents() );

                                wrap.show();

                                if (currentOpts.opacity) {
                                        final_pos.opacity = 0;
                                }

                                fx.prop = 0;

                                _cookiepolicyfancybox(fx).animate({prop: 1}, {
                                         duration : currentOpts.speedIn,
                                         easing : currentOpts.easingIn,
                                         step : _draw,
                                         complete : _finish
                                });

                                return;
                        }

                        if (currentOpts.titlePosition == 'inside' && titleHeight > 0) { 
                                title.show();   
                        }

                        content
                                .css({
                                        'width' : final_pos.width - currentOpts.padding * 2,
                                        'height' : selectedOpts.autoDimensions ? 'auto' : final_pos.height - titleHeight - currentOpts.padding * 2
                                })
                                .html( tmp.contents() );

                        wrap
                                .css(final_pos)
                                .fadeIn( currentOpts.transitionIn == 'none' ? 0 : currentOpts.speedIn, _finish );
                },

                _format_title = function(title) {
                        if (title && title.length) {
                                if (currentOpts.titlePosition == 'float') {
                                        return '<table id="oupcookiepolicy_fancybox-title-float-wrap" cellpadding="0" cellspacing="0"><tr><td id="oupcookiepolicy_fancybox-title-float-left"></td><td id="oupcookiepolicy_fancybox-title-float-main">' + title + '</td><td id="oupcookiepolicy_fancybox-title-float-right"></td></tr></table>';
                                }

                                return '<div id="oupcookiepolicy_fancybox-title-' + currentOpts.titlePosition + '">' + title + '</div>';
                        }

                        return false;
                },

                _process_title = function() {
                        titleStr = currentOpts.title || '';
                        titleHeight = 0;

                        title
                                .empty()
                                .removeAttr('style')
                                .removeClass();

                        if (currentOpts.titleShow === false) {
                                title.hide();
                                return;
                        }

                        titleStr = _cookiepolicyfancybox.isFunction(currentOpts.titleFormat) ? currentOpts.titleFormat(titleStr, currentArray, currentIndex, currentOpts) : _format_title(titleStr);

                        if (!titleStr || titleStr === '') {
                                title.hide();
                                return;
                        }

                        title
                                .addClass('oupcookiepolicy_fancybox-title-' + currentOpts.titlePosition)
                                .html( titleStr )
                                .appendTo( 'body' )
                                .show();

                        switch (currentOpts.titlePosition) {
                                case 'inside':
                                        title
                                                .css({
                                                        'width' : final_pos.width - (currentOpts.padding * 2),
                                                        'marginLeft' : currentOpts.padding,
                                                        'marginRight' : currentOpts.padding
                                                });

                                        titleHeight = title.outerHeight(true);

                                        title.appendTo( outer );

                                        final_pos.height += titleHeight;
                                break;

                                case 'over':
                                        title
                                                .css({
                                                        'marginLeft' : currentOpts.padding,
                                                        'width' : final_pos.width - (currentOpts.padding * 2),
                                                        'bottom' : currentOpts.padding
                                                })
                                                .appendTo( outer );
                                break;

                                case 'float':
                                        title
                                                .css('left', parseInt((title.width() - final_pos.width - 40)/ 2, 10) * -1)
                                                .appendTo( wrap );
                                break;

                                default:
                                        title
                                                .css({
                                                        'width' : final_pos.width - (currentOpts.padding * 2),
                                                        'paddingLeft' : currentOpts.padding,
                                                        'paddingRight' : currentOpts.padding
                                                })
                                                .appendTo( wrap );
                                break;
                        }

                        title.hide();
                },

                _set_navigation = function() {
                        if (currentOpts.enableEscapeButton || currentOpts.enableKeyboardNav) {
                                _cookiepolicyfancybox(document).bind('keydown.fb', function(e) {
                                        if (e.keyCode == 27 && currentOpts.enableEscapeButton) {
                                                e.preventDefault();
                                                _cookiepolicyfancybox.oupcookiepolicy_fancybox.close();

                                        } else if ((e.keyCode == 37 || e.keyCode == 39) && currentOpts.enableKeyboardNav && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'SELECT') {
                                                e.preventDefault();
                                                _cookiepolicyfancybox.oupcookiepolicy_fancybox[ e.keyCode == 37 ? 'prev' : 'next']();
                                        }
                                });
                        }

                        if (!currentOpts.showNavArrows) { 
                                nav_left.hide();
                                nav_right.hide();
                                return;
                        }

                        if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex !== 0) {
                                nav_left.show();
                        }

                        if ((currentOpts.cyclic && currentArray.length > 1) || currentIndex != (currentArray.length -1)) {
                                nav_right.show();
                        }
                },

                _finish = function () {
                        if (!_cookiepolicyfancybox.support.opacity) {
                                content.get(0).style.removeAttribute('filter');
                                wrap.get(0).style.removeAttribute('filter');
                        }

                        if (selectedOpts.autoDimensions) {
                                content.css('height', 'auto');
                        }

                        wrap.css('height', 'auto');

                        if (titleStr && titleStr.length) {
                                title.show();
                        }

                        if (currentOpts.showCloseButton) {
                                close.show();
                        }

                        _set_navigation();
        
                        if (currentOpts.hideOnContentClick)     {
                                content.bind('click', _cookiepolicyfancybox.oupcookiepolicy_fancybox.close);
                        }

                        if (currentOpts.hideOnOverlayClick)     {
                                overlay.bind('click', _cookiepolicyfancybox.oupcookiepolicy_fancybox.close);
                        }

                        _cookiepolicyfancybox(window).bind("resize.fb", _cookiepolicyfancybox.oupcookiepolicy_fancybox.resize);

                        if (currentOpts.centerOnScroll) {
                                _cookiepolicyfancybox(window).bind("scroll.fb", _cookiepolicyfancybox.oupcookiepolicy_fancybox.center);
                        }

                        if (currentOpts.type == 'iframe') {
                                _cookiepolicyfancybox('<iframe id="oupcookiepolicy_fancybox-frame" name="oupcookiepolicy_fancybox-frame' + new Date().getTime() + '" frameborder="0" hspace="0" ' + (_cookiepolicyfancybox.browser.msie ? 'allowtransparency="true""' : '') + ' scrolling="' + selectedOpts.scrolling + '" src="' + currentOpts.href + '"></iframe>').appendTo(content);
                        }

                        wrap.show();

                        busy = false;

                        _cookiepolicyfancybox.oupcookiepolicy_fancybox.center();

                        currentOpts.onComplete(currentArray, currentIndex, currentOpts);

                        _preload_images();
                },

                _preload_images = function() {
                        var href, 
                                objNext;

                        if ((currentArray.length -1) > currentIndex) {
                                href = currentArray[ currentIndex + 1 ].href;

                                if (typeof href !== 'undefined' && href.match(imgRegExp)) {
                                        objNext = new Image();
                                        objNext.src = href;
                                }
                        }

                        if (currentIndex > 0) {
                                href = currentArray[ currentIndex - 1 ].href;

                                if (typeof href !== 'undefined' && href.match(imgRegExp)) {
                                        objNext = new Image();
                                        objNext.src = href;
                                }
                        }
                },

                _draw = function(pos) {
                        var dim = {
                                width : parseInt(start_pos.width + (final_pos.width - start_pos.width) * pos, 10),
                                height : parseInt(start_pos.height + (final_pos.height - start_pos.height) * pos, 10),

                                top : parseInt(start_pos.top + (final_pos.top - start_pos.top) * pos, 10),
                                left : parseInt(start_pos.left + (final_pos.left - start_pos.left) * pos, 10)
                        };

                        if (typeof final_pos.opacity !== 'undefined') {
                                dim.opacity = pos < 0.5 ? 0.5 : pos;
                        }

                        wrap.css(dim);

                        content.css({
                                'width' : dim.width - currentOpts.padding * 2,
                                'height' : dim.height - (titleHeight * pos) - currentOpts.padding * 2
                        });
                },

                _get_viewport = function() {
                        return [
                                _cookiepolicyfancybox(window).width() - (currentOpts.margin * 2),
                                _cookiepolicyfancybox(window).height() - (currentOpts.margin * 2),
                                _cookiepolicyfancybox(document).scrollLeft() + currentOpts.margin,
                                _cookiepolicyfancybox(document).scrollTop() + currentOpts.margin
                        ];
                },

                _get_zoom_to = function () {
                        var view = _get_viewport(),
                                to = {},
                                resize = currentOpts.autoScale,
                                double_padding = currentOpts.padding * 2,
                                ratio;

                        if (currentOpts.width.toString().indexOf('%') > -1) {
                                to.width = parseInt((view[0] * parseFloat(currentOpts.width)) / 100, 10);
                        } else {
                                to.width = currentOpts.width + double_padding;
                        }

                        if (currentOpts.height.toString().indexOf('%') > -1) {
                                to.height = parseInt((view[1] * parseFloat(currentOpts.height)) / 100, 10);
                        } else {
                                to.height = currentOpts.height + double_padding;
                        }

                        if (resize && (to.width > view[0] || to.height > view[1])) {
                                if (selectedOpts.type == 'image' || selectedOpts.type == 'swf') {
                                        ratio = (currentOpts.width ) / (currentOpts.height );

                                        if ((to.width ) > view[0]) {
                                                to.width = view[0];
                                                to.height = parseInt(((to.width - double_padding) / ratio) + double_padding, 10);
                                        }

                                        if ((to.height) > view[1]) {
                                                to.height = view[1];
                                                to.width = parseInt(((to.height - double_padding) * ratio) + double_padding, 10);
                                        }

                                } else {
                                        to.width = Math.min(to.width, view[0]);
                                        to.height = Math.min(to.height, view[1]);
                                }
                        }

                        to.top = parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - to.height - 40) * 0.5)), 10);
                        to.left = parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - to.width - 40) * 0.5)), 10);

                        return to;
                },

                _get_obj_pos = function(obj) {
                        var pos = obj.offset();

                        pos.top += parseInt( obj.css('paddingTop'), 10 ) || 0;
                        pos.left += parseInt( obj.css('paddingLeft'), 10 ) || 0;

                        pos.top += parseInt( obj.css('border-top-width'), 10 ) || 0;
                        pos.left += parseInt( obj.css('border-left-width'), 10 ) || 0;

                        pos.width = obj.width();
                        pos.height = obj.height();

                        return pos;
                },

                _get_zoom_from = function() {
                        var orig = selectedOpts.orig ? _cookiepolicyfancybox(selectedOpts.orig) : false,
                                from = {},
                                pos,
                                view;

                        if (orig && orig.length) {
                                pos = _get_obj_pos(orig);

                                from = {
                                        width : pos.width + (currentOpts.padding * 2),
                                        height : pos.height + (currentOpts.padding * 2),
                                        top     : pos.top - currentOpts.padding - 20,
                                        left : pos.left - currentOpts.padding - 20
                                };

                        } else {
                                view = _get_viewport();

                                from = {
                                        width : currentOpts.padding * 2,
                                        height : currentOpts.padding * 2,
                                        top     : parseInt(view[3] + view[1] * 0.5, 10),
                                        left : parseInt(view[2] + view[0] * 0.5, 10)
                                };
                        }

                        return from;
                },

                _animate_loading = function() {
                        if (!loading.is(':visible')){
                                clearInterval(loadingTimer);
                                return;
                        }

                        _cookiepolicyfancybox('div', loading).css('top', (loadingFrame * -40) + 'px');

                        loadingFrame = (loadingFrame + 1) % 12;
                };

        /*
         * Public methods 
         */


        _cookiepolicyfancybox.fn.oupcookiepolicy_fancybox = function(options) {
                if (!_cookiepolicyfancybox(this).length) {
                        return this;
                }

                _cookiepolicyfancybox(this)
                        .data('oupcookiepolicy_fancybox', _cookiepolicyfancybox.extend({}, options, (_cookiepolicyfancybox.metadata ? _cookiepolicyfancybox(this).metadata() : {})))
                        .unbind('click.fb')
                        .bind('click.fb', function(e) {
                                e.preventDefault();

                                if (busy) {
                                        return;
                                }

                                busy = true;

                                _cookiepolicyfancybox(this).blur();

                                selectedArray = [];
                                selectedIndex = 0;

                                var rel = _cookiepolicyfancybox(this).attr('rel') || '';

                                if (!rel || rel == '' || rel === 'nofollow') {
                                        selectedArray.push(this);

                                } else {
                                        selectedArray = _cookiepolicyfancybox("a[rel=" + rel + "], area[rel=" + rel + "]");
                                        selectedIndex = selectedArray.index( this );
                                }

                                _start();

                                return;
                        });

                return this;
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox = function(obj) {
                var opts;

                if (busy) {
                        return;
                }

                busy = true;
                opts = typeof arguments[1] !== 'undefined' ? arguments[1] : {};

                selectedArray = [];
                selectedIndex = parseInt(opts.index, 10) || 0;

                if (_cookiepolicyfancybox.isArray(obj)) {
                        for (var i = 0, j = obj.length; i < j; i++) {
                                if (typeof obj[i] == 'object') {
                                        _cookiepolicyfancybox(obj[i]).data('oupcookiepolicy_fancybox', _cookiepolicyfancybox.extend({}, opts, obj[i]));
                                } else {
                                        obj[i] = _cookiepolicyfancybox({}).data('oupcookiepolicy_fancybox', _cookiepolicyfancybox.extend({content : obj[i]}, opts));
                                }
                        }

                        selectedArray = jQuery.merge(selectedArray, obj);

                } else {
                        if (typeof obj == 'object') {
                                _cookiepolicyfancybox(obj).data('oupcookiepolicy_fancybox', _cookiepolicyfancybox.extend({}, opts, obj));
                        } else {
                                obj = _cookiepolicyfancybox({}).data('oupcookiepolicy_fancybox', _cookiepolicyfancybox.extend({content : obj}, opts));
                        }

                        selectedArray.push(obj);
                }

                if (selectedIndex > selectedArray.length || selectedIndex < 0) {
                        selectedIndex = 0;
                }

                _start();
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.showActivity = function() {
                clearInterval(loadingTimer);

                loading.show();
                loadingTimer = setInterval(_animate_loading, 66);
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.hideActivity = function() {
                loading.hide();
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.next = function() {
                return _cookiepolicyfancybox.oupcookiepolicy_fancybox.pos( currentIndex + 1);
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.prev = function() {
                return _cookiepolicyfancybox.oupcookiepolicy_fancybox.pos( currentIndex - 1);
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.pos = function(pos) {
                if (busy) {
                        return;
                }

                pos = parseInt(pos);

                selectedArray = currentArray;

                if (pos > -1 && pos < currentArray.length) {
                        selectedIndex = pos;
                        _start();

                } else if (currentOpts.cyclic && currentArray.length > 1) {
                        selectedIndex = pos >= currentArray.length ? 0 : currentArray.length - 1;
                        _start();
                }

                return;
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.cancel = function() {
                if (busy) {
                        return;
                }

                busy = true;

                _cookiepolicyfancybox.event.trigger('oupcookiepolicy_fancybox-cancel');

                _abort();

                selectedOpts.onCancel(selectedArray, selectedIndex, selectedOpts);

                busy = false;
        };

        // Note: within an iframe use - parent._cookiepolicyfancybox.oupcookiepolicy_fancybox.close();
        _cookiepolicyfancybox.oupcookiepolicy_fancybox.close = function() {
                if (busy || wrap.is(':hidden')) {
                        return;
                }

                busy = true;

			//alert('currentOpts.onCleanup  1 :'+currentOpts.onCleanup);

                if (currentOpts && false === currentOpts.onCleanup(currentArray, currentIndex, currentOpts)) {
                        busy = false;
                        return;
                }

                _abort();

                _cookiepolicyfancybox(close.add( nav_left ).add( nav_right )).hide();

                _cookiepolicyfancybox(content.add( overlay )).unbind();

                _cookiepolicyfancybox(window).unbind("resize.fb scroll.fb");
                _cookiepolicyfancybox(document).unbind('keydown.fb');

                content.find('iframe').attr('src', isIE6 && /^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank');

                if (currentOpts.titlePosition !== 'inside') {
                        title.empty();
                }

                wrap.stop();

                function _cleanup() {
                        overlay.fadeOut('fast');

                        title.empty().hide();
                        wrap.hide();

                        _cookiepolicyfancybox.event.trigger('oupcookiepolicy_fancybox-cleanup');

                        content.empty();

                        //currentOpts.onClosed(currentArray, currentIndex, currentOpts);

                        currentArray = selectedOpts     = [];
                        currentIndex = selectedIndex = 0;
                        currentOpts = selectedOpts      = {};

                        busy = false;
                }

                if (currentOpts.transitionOut == 'elastic') {
                        start_pos = _get_zoom_from();

                        var pos = wrap.position();

                        final_pos = {
                                top      : pos.top ,
                                left : pos.left,
                                width : wrap.width(),
                                height : wrap.height()
                        };

                        if (currentOpts.opacity) {
                                final_pos.opacity = 1;
                        }

                        title.empty().hide();

                        fx.prop = 1;

                        _cookiepolicyfancybox(fx).animate({ prop: 0 }, {
                                 duration : currentOpts.speedOut,
                                 easing : currentOpts.easingOut,
                                 step : _draw,
                                 complete : _cleanup
                        });

                } else {
                        wrap.fadeOut( currentOpts.transitionOut == 'none' ? 0 : currentOpts.speedOut, _cleanup);
                }
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.resize = function() {
                if (overlay.is(':visible')) {
                        overlay.css('height', _cookiepolicyfancybox(document).height());
                }

                _cookiepolicyfancybox.oupcookiepolicy_fancybox.center(true);
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.center = function() {
                var view, align;

                if (busy) {
                        return; 
                }

                align = arguments[0] === true ? 1 : 0;
                view = _get_viewport();

                if (!align && (wrap.width() > view[0] || wrap.height() > view[1])) {
                        return; 
                }

                wrap
                        .stop()
                        .animate({
                                'top' : parseInt(Math.max(view[3] - 20, view[3] + ((view[1] - content.height() - 40) * 0.5) - currentOpts.padding)),
                                'left' : parseInt(Math.max(view[2] - 20, view[2] + ((view[0] - content.width() - 40) * 0.5) - currentOpts.padding))
                        }, typeof arguments[0] == 'number' ? arguments[0] : 200);
        };

        _cookiepolicyfancybox.oupcookiepolicy_fancybox.init = function() {
                if (_cookiepolicyfancybox("#oupcookiepolicy_fancybox-wrap").length) {
                        return;
                }

                _cookiepolicyfancybox('body').append(
                        tmp     = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-tmp"></div>'),
                        loading = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-loading"><div></div></div>'),
                        overlay = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-overlay"></div>'),
                        wrap = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-wrap"></div>')
                );

                outer = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-outer"></div>')
                        .append('<div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-n"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-ne"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-e"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-se"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-s"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-sw"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-w"></div><div class="oupcookiepolicy_fancybox-bg" id="oupcookiepolicy_fancybox-bg-nw"></div>')
                        .appendTo( wrap );

                outer.append(
                        content = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-content"></div>'),
                        close = _cookiepolicyfancybox('<a id=""></a>'),
                        title = _cookiepolicyfancybox('<div id="oupcookiepolicy_fancybox-title"></div>'),

                        nav_left = _cookiepolicyfancybox('<a href="javascript:;" id="oupcookiepolicy_fancybox-left"><span class="fancy-ico" id="oupcookiepolicy_fancybox-left-ico"></span></a>'),
                        nav_right = _cookiepolicyfancybox('<a href="javascript:;" id="oupcookiepolicy_fancybox-right"><span class="fancy-ico" id="oupcookiepolicy_fancybox-right-ico"></span></a>')
                );

                close.click(_cookiepolicyfancybox.oupcookiepolicy_fancybox.close);
                loading.click(_cookiepolicyfancybox.oupcookiepolicy_fancybox.cancel);

                nav_left.click(function(e) {
                        e.preventDefault();
                        _cookiepolicyfancybox.oupcookiepolicy_fancybox.prev();
                });

                nav_right.click(function(e) {
                        e.preventDefault();
                        _cookiepolicyfancybox.oupcookiepolicy_fancybox.next();
                });

                if (_cookiepolicyfancybox.fn.mousewheel) {
                        wrap.bind('mousewheel.fb', function(e, delta) {
                                if (busy) {
                                        e.preventDefault();

                                } else if (_cookiepolicyfancybox(e.target).get(0).clientHeight == 0 || _cookiepolicyfancybox(e.target).get(0).scrollHeight === _cookiepolicyfancybox(e.target).get(0).clientHeight) {
                                        e.preventDefault();
                                        _cookiepolicyfancybox.oupcookiepolicy_fancybox[ delta > 0 ? 'prev' : 'next']();
                                }
                        });
                }

                if (!_cookiepolicyfancybox.support.opacity) {
                        wrap.addClass('oupcookiepolicy_fancybox-ie');
                }

                if (isIE6) {
                        loading.addClass('oupcookiepolicy_fancybox-ie6');
                        wrap.addClass('oupcookiepolicy_fancybox-ie6');

                        _cookiepolicyfancybox('<iframe id="oupcookiepolicy_fancybox-hide-sel-frame" src="' + (/^https/i.test(window.location.href || '') ? 'javascript:void(false)' : 'about:blank' ) + '" scrolling="no" border="0" frameborder="0" tabindex="-1"></iframe>').prependTo(outer);
                }
        };


        _cookiepolicyfancybox.fn.oupcookiepolicy_fancybox.defaults = {
                padding : 10,
                margin : 40,
                opacity : false,
                modal : false,
                cyclic : false,
                scrolling : 'auto',     // 'auto', 'yes' or 'no'

                width : 560,
                height : 340,

                autoScale : true,
                autoDimensions : true,
                centerOnScroll : false,

                ajax : {},
                swf : { wmode: 'transparent' },

                hideOnOverlayClick : true,
                hideOnContentClick : false,

                overlayShow : true,
                overlayOpacity : 0.7,
                overlayColor : '#777',

                titleShow : true,
                titlePosition : 'float', // 'float', 'outside', 'inside' or 'over'
                titleFormat : null,
                titleFromAlt : false,

                transitionIn : 'fade', // 'elastic', 'fade' or 'none'
                transitionOut : 'fade', // 'elastic', 'fade' or 'none'

                speedIn : 300,
                speedOut : 300,

                changeSpeed : 300,
                changeFade : 'fast',

                easingIn : 'swing',
                easingOut : 'swing',

                showCloseButton  : true,
                showNavArrows : true,
                enableEscapeButton : false,
                enableKeyboardNav : true,

                onStart : function(){},
                onCancel : function(){},
                onComplete : function(){},
                onCleanup : function(){},
                onClosed : function(){},
                onError : function(){}
        };



        _cookiepolicyfancybox(document).ready(function() {
                _cookiepolicyfancybox.oupcookiepolicy_fancybox.init();
        });




})(jQuery);