(function(t){t.fn.tagcloud=function(e){var n=t.extend({},t.fn.tagcloud.defaults,e);tagWeights=this.map(function(){return t(this).attr("rel")});tagWeights=jQuery.makeArray(tagWeights).sort(o);lowest=tagWeights[0];highest=tagWeights.pop();range=highest-lowest;if(range===0){range=1}if(n.size){fontIncr=(n.size.end-n.size.start)/range}if(n.color){colorIncr=r(n.color,range)}return this.each(function(){weighting=t(this).attr("rel")-lowest;if(n.size){t(this).css({"font-size":n.size.start+weighting*fontIncr+n.size.unit})}if(n.color){t(this).css({backgroundColor:i(n.color,colorIncr,weighting)})}})};t.fn.tagcloud.defaults={size:{start:14,end:18,unit:"pt"}};function e(t){if(t.length==4){t=jQuery.map(/\w+/.exec(t),function(t){return t+t}).join("")}hex=/(\w{2})(\w{2})(\w{2})/.exec(t);return[parseInt(hex[1],16),parseInt(hex[2],16),parseInt(hex[3],16)]}function n(t){return"#"+jQuery.map(t,function(t){hex=t.toString(16);hex=hex.length==1?"0"+hex:hex;return hex}).join("")}function r(t,n){return jQuery.map(e(t.end),function(r,i){return(r-e(t.start)[i])/n})}function i(t,r,i){rgb=jQuery.map(e(t.start),function(t,e){ref=Math.round(t+r[e]*i);if(ref>255){ref=255}else{if(ref<0){ref=0}}return ref});return n(rgb)}function o(t,e){return t-e}})(jQuery);