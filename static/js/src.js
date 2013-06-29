function evUploadPictureChange(){if(this.files){var e=new FormData;e.append("image",this.files[0]);var t=new XMLHttpRequest;t.upload.addEventListener("progress",uploadProgress,!1),t.addEventListener("load",uploadComplete,!1),t.addEventListener("error",uploadFailed,!1),t.addEventListener("abort",uploadCanceled,!1),t.open("POST","http://127.0.0.1:3000/img"),console.log(e),t.send(e),$("#upload-progress").remove(),this.parentNode.appendChild(div({id:"upload-progress","class":"cf",style:" margin-top:10px;background-color:#4d161a; width:auto; height:10px;"},[div({id:"progress-bar",style:"float:left;width:0%; height:100%;background-color:#ff475a;-webkit-transition:all 400ms; transition:all 400ms;"})]))}}function uploadProgress(e){console.log("progressing"),document.getElementById("progress-bar").style.width=parseInt(100*(parseFloat(e.loaded)/e.total))+"%"}function uploadComplete(){pop("Upload Complete!","slide"),setTimeout(function(){popOut()},1100)}function uploadFailed(){console.log("upload failed")}function uploadCanceled(){console.log("upload canceled")}function mousePosition(e){var t=0,r=0;if(!e)var e=window.event;return e.pageX||e.pageY?(t=e.pageX,r=e.pageY):(e.clientX||e.clientY)&&(t=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft,r=e.clientY+document.body.scrollTop+document.documentElement.scrollTop),[t,r]}function buSureDeleteArticle(e){pop(div([p("Are you sure you would like to delete this article?"),button("yes",{click:function(){buDeleteArticle(e)}}),span(" "),button("no",{click:closePop})]),"slide")}function buDeleteArticle(e){go_ajax("/control-panel/_article/"+e,"DELETE",{},perfDeleteArticle)}function perfDeleteArticle(e){return e.error?pop(e.error,"error"):(jam_manage_article_rows.filter('tr[data-link="'+e.link+'"]').remove(),popOut(),void 0)}function buUnpublishArticle(e){var t=$('[data-link="'+e+'"]').find("[data-published]");go_ajax("/control-panel/_article/"+e+"/unpublish","PATCH",{},perfUnpublishArticle,{context:t})}function perfUnpublishArticle(e){return e.error?pop(e.error,"error"):($(this).attr("data-published","false"),pop("The article has been unpublished","slide"),setTimeout(popOut,1e3),void 0)}function buPublishArticle(e){var t=$('[data-link="'+e+'"]').find("[data-published]");go_ajax("/control-panel/_article/"+e+"/publish","PATCH",{},perfPublishArticle,{context:t})}function perfPublishArticle(e){return e.error?pop(e.error,"error"):($(this).attr("data-published","true"),pop("Article successfully published!","slide"),setTimeout(popOut,1e3),void 0)}function articleContextMenu(e){document.forceEscape&&document.forceEscape();var t=mousePosition(e),r=t[0],o=t[1],i=this.parentNode.getAttribute("data-link"),n="true"===$(this.parentNode).find("[data-published]").first().attr("data-published"),s=button(n?"unpublish":"publish",{style:"display:block;",click:n?function(){buUnpublishArticle(i)}:function(){buPublishArticle(i)}});return document.body.appendChild(div({"class":"context-menu",id:"art-context-menu",style:"position:absolute; left:"+r+"px; top:"+o+"px"},[a("open",{href:"/article/"+i,"class":"button",style:"display:block"}),button("delete",{style:"display:block",click:function(){buSureDeleteArticle(i)}}),s])),escapeState("art-context-menu"),!1}function perfNewCategory(e){return e.error?pop(e.error,"error"):($("#cp-table").find("tbody").append(tr({"data-name":e.name},[td([a(e.name,{href:"/category/"+e.name,"class":"hover-link"})],{contextmenu:categoryContextMenu}),td("0 Articles"),td({click:categoryContextMenu})])),popOut(),void 0)}function buCreateCategory(e){return e.match(/^[a-zA-Z0-9\- _]*$/)?(go_ajax("/control-panel/category/"+e,"POST",{},perfNewCategory),void 0):pop("Illegal characters in category name","error")}function keypressCategoryName(e){var t=e.keyCode;13===t&&this.value&&buCreateCategory(this.value)}function buSureDeleteCategory(e){pop(div([p("Are you sure you would like to delete the category: "+e+"?"),button("yes",{click:function(){buDeleteCategory(e)}}),span(" "),button("no",{click:closePop})]),"slide")}function buDeleteCategory(e){go_ajax("/control-panel/_category/"+e,"DELETE",{},perfDeleteCategory)}function perfDeleteCategory(e){return e.error?pop(e.error,"error"):($("#cp-table.manage-categories").find('tr[data-name="'+e.name+'"]').remove(),popOut(),void 0)}function categoryContextMenu(e){document.forceEscape&&document.forceEscape();var t=mousePosition(e),r=t[0],a=t[1],o=this.parentNode.getAttribute("data-name");return document.body.appendChild(div({"class":"context-menu",id:"art-context-menu",style:"position:absolute; left:"+r+"px; top:"+a+"px"},[button("delete",{style:"display:block",click:function(){buSureDeleteCategory(o)}})])),escapeState("art-context-menu"),!1}function evCheckHomeScroll(){if($(document).height()-($(this).scrollTop()+$(window).height())<200){var e=$(".article").last(),t=e.attr("data-link"),r=parseInt(e.find(".article-meta [data-timestamp]").attr("data-timestamp"));$(window).unbind("scroll",evCheckHomeScroll),$(".loading").show(),go_ajax("/_?last_link="+t+"&timestamp="+r,"GET",perfAppendMoreArticles,{complete:function(e,t){$(".loading").hide(),-1!==["notmodified","error","timeout","abort","parsererror"].indexOf(t)&&$(window).bind("scroll",evCheckHomeScroll)}})}}function perfAppendMoreArticles(e){if(!e.error&&e.more_articles){if(0===e.more_articles.length)return $("#articles").after(div({"class":"gab",style:"margin:30px 0;font-size:25px; text-align:center;"},"~ THE END ~"));for(var t,r,o,i=0;i<e.more_articles.length;i++){t=e.more_articles[i],r=div({"class":"categories"});for(var n=0;n<t.categories.length;n++)o=t.categories[n],r.appendChild(a(o,{href:"/category/"+o,"class":"hover-link"}));$("#articles").append(li({"class":"article cf","data-link":t._id},[div([h1({"class":"article-head"},[a(t.title,{href:"/article/"+t._id,"class":"hover-link"})]),div(t.content,{"class":"article-content"})]),div({"class":"article-meta"},[div({"data-timestamp":t.created,"data-time-mode":"1"}),r])]))}}$(window).bind("scroll",evCheckHomeScroll)}function urlArticleLink(){return _path_name.match(/^\/control\-panel\/article\/[\w\-]+\/edit/)[0]}function categoryCount(){return parseInt($("#number-of-categories").val())}function increaseCategory(){$("#number-of-categories").val(categoryCount()+1)}function decreaseCategory(){$("#number-of-categories").val(categoryCount()-1)}function markDown(e){var t=new Markdown.Converter;return t.makeHtml(e)}function fetchArticleDetails(){return dict={title:$("#x-head").val(),markdown:$("#x-body").val(),categories:fetchCategories()}}function fetchCategories(){var e,t=[];return $(".x-article-category").each(function(){e=$(this).val(),e&&-1===t.indexOf(e)&&t.push(e)}),t}function createArticle(){var e=fetchArticleDetails();return 0===e.title.length?pop("No title given","error"):(go_ajax("/control-panel/_article/create","POST",e,perfCreateArticle,{context:this}),void 0)}function perfCreateArticle(e){if(console.log(this),e.error)return pop(e.error,"error");var t=$(this);t.attr("data-article-created","true"),history.pushState({},"","/control-panel/article/"+urlArticleLink()+"/edit"),pop("Article Successfully Created!","success"),$("[data-published]").show(),$("#ae-created").show().find("span").attr("data-timestamp",cur_timestamp()),$("#ae-last-saved").show().find("span").attr("data-timestamp",cur_timestamp()),setTimeout(popOut,700)}function saveArticle(e){var t=fetchArticleDetails();return 0===t.title.length?pop("No title given","error"):(go_ajax("/control-panel/_article/"+e,"PATCH",t,perfSaveArticle),void 0)}function perfSaveArticle(e){return e.error?pop(e.error,"error"):(history.pushState({},"","/control-panel/article/"+e.link+"/edit"),pop("Article Successfully Saved!","success"),$("#ae-last-saved").find("span").attr("data-timestamp",cur_timestamp()),setTimeout(popOut,700),void 0)}function pageArticleLink(){return _path_name.substring(_path_name.lastIndexOf("/")+1)}function evLoadComments(){$(".loading.more-comments").show(),go_ajax(_path_name+"/_comments","GET",perfLoadComments,{error:function(){return $(".loading.more-comments").removeClass("more-comments").show().html(span("Error Retrieving Comments",{"class":"color"}).outerHTML)}})}function perfLoadComments(e){if(console.log(e),e.error)return $(".loading.more-comments").after(div("Error Retrieving Comments",{"class":"color",style:"font-size:20px; margin-bottom:25px"})).hide();$(".loading").hide();var t=e.comments;if(t)for(var r,a=$("#comments-section").children("ul"),o=t.length-1;o>=0;o--){r=[];for(var i=0;i<t[o].replies.length;i++)r.push(htmlCommentReply(t[o].replies[i]));a.append(htmlComment(t[o],r))}}function findCommentFormDetails(e){return{content:e.find("textarea").val(),name:e.find('input[type="text"]').val(),website:e.find('input[type="url"]').val(),email:e.find('input[type="email"]').val()}}function deleteCommentFormDetails(e){e.find("textarea").val(""),e.find('input[type="text"]').val(""),e.find('input[type="url"]').val(""),e.find('input[type="email"]').val("")}function commentFormValidate(e){return""===e.content?!1:""===e.name?pop("Please fill out your name.","error"):""===e.email?pop("Please fill out your email address.","error"):validEmail(e.email)?!0:pop("Please enter a valid email, confirmation will be required.","error")}function htmlComment(e,t){var r=e.website?a(e.name,{href:e.website,"class":"hover-link"}):span(e.name);return li({"class":"cf slide-left","data-comment-id":e.comment_id},[img({src:e.img,height:70,width:70}),div(e.content),div({"class":"comment-meta"},[r,br(),span({"data-timestamp":e.created,"data-time-mode":"2"}),br(),button({"class":"bu-form-reply-comment",click:buFormReplyComment})]),ul(t?t:void 0)])}function perfPostComment(e){return e.error?pop(e.error,"error"):($("html, body").animate({scrollTop:$("#comments-section").offset().top},200),$("#comments-section").children("ul").prepend(htmlComment(e)),deleteCommentFormDetails($("#leave-comment")),pop(p({html:"Your comment has been posted as of now, however confirmation is <b><i>required</i></b>.<br><br>Please check your inbox for the confirmation mail; click on the link given in the email (this link lasts 2 hours)<br><br>If this confirmation is not performed, your comment will be <b><i>deleted</i></b> in 2 hours."}),"slide"),void 0)}function buFormReplyComment(){var e=$(this);e.prop("disabled",!0);var t=e.closest("li");t.append(div({"class":"cf comment-form"},[div({"class":"non-comment-details cf"},[input({type:"text",placeholder:"Full Name",maxlength:"100"}),input({type:"email",placeholder:"Email Address",maxlength:"255"}),input({type:"url",placeholder:"Website/Blog (Optional)",maxlength:"100"})]),textarea({placeholder:"Reply...",maxlength:"1000",rows:2,focus:function(){$(this).autosize()}}),button({"class":"bu-reply-comment",click:buReplyComment},"Post"),button({"class":"bu-cancel-reply",click:buCancelReply},"Cancel")])),$("html, body").animate({scrollTop:t.find(".comment-form").offset().top-190},450),t.find('input[type="text"]').focus()}function buCancelReply(){var e=$(this).closest("li");e.find(".bu-form-reply-comment").prop("disabled",!1),e.find(".comment-form").remove()}function buReplyComment(){var e=findCommentFormDetails($(this).closest("li").find(".comment-form"));return commentFormValidate(e)?(e.parent_comment_id=parseInt($(this).closest("li").attr("data-comment-id")),go_ajax(_path_name+"/_comments","POST",e,function(t){console.log(e),t.parent_comment_id=e.parent_comment_id,t.created=cur_timestamp(),t.content=e.content,t.name=e.name,t.website=e.website,perfReplyComment(t)}),void 0):!1}function htmlCommentReply(e){var t=e.website?a(e.name,{href:e.website,"class":"hover-link"}):span(e.name);return li({"class":"cf slide-left","data-comment-id":e.comment_id},[img({src:e.img,height:70,width:70}),div(e.content),div({"class":"comment-meta"},[t,br(),span({"data-timestamp":e.created,"data-time-mode":"2"})])])}function perfReplyComment(e){if(e.error)return pop(e.error,"error");var t=$("[data-comment-id="+e.parent_comment_id+"]");t.find("ul").append(htmlCommentReply(e)),t.find(".comment-form").remove(),t.find(".bu-form-reply-comment").prop("disabled",!1),pop(p({html:"Your comment has been posted as of now, however confirmation is <b><i>required</i></b>.<br><br>Please check your inbox for the confirmation mail; click on the link given in the email (this link lasts 2 hours)<br><br>If this confirmation is not performed, your comment will be <b><i>deleted</i></b> in 2 hours."}),"slide")}function remove_px(e){var t=e.indexOf("px");return-1!==t?parseInt(e.substr(0,t)):void 0}function arrowDown(e){return 40===e.keyCode}function arrowUp(e){return 38===e.keyCode}function suggestionsUpKey(){null===document.getElementById("spotlight")?jam_search_suggestions.children().last().attr("id","spotlight"):(jam_cur_spotlight=$("#spotlight"),jam_cur_spotlight.attr("id",""),void 0!==jam_cur_spotlight.prev()?jam_cur_spotlight.prev().attr("id","spotlight"):jam_search_suggestions.children().last().attr("id","spotlight"))}function suggestionsDownKey(){null===document.getElementById("spotlight")?jam_search_suggestions.children().first().attr("id","spotlight"):(jam_cur_spotlight=$("#spotlight"),jam_cur_spotlight.attr("id",""),void 0!==jam_cur_spotlight.next()?jam_cur_spotlight.next().attr("id","spotlight"):jam_search_suggestions.children().first().attr("id","spotlight"))}function search_suggest(e){e=e.toLowerCase(),bring_json("/_search",make_keywords(e),perf_search_suggest)}function make_keywords(e){e=e.replace(/[\W]/g," "),e=e.replace(/\s+/g," ");var t=e.split(" "),r=[],a=1;" "===e[e.length-1]&&(a=0);for(var o=0;o<t.length-a;o++)t[o].length>1&&-1===r.indexOf(t[o])&&r.push(t[o]);return 1==a?{"other-keywords":r,"last-keyword":t.pop()}:{"other-keywords":r,"last-keyword":""}}function perf_search_suggest(e){var t=e.suggestions;if(0!=t.length){display_search_suggestions();for(var r=0;r<t.length;r++)add_suggestion(t[r][0],t[r][1],t[r][2])}}function display_search_suggestions(){var e=jam_search_query.offset();jam_search_suggestions.css("left",e.left+"px"),jam_search_suggestions.css("top",e.top-$(document).scrollTop()+33+"px"),jam_search_suggestions.show()}function add_suggestion(e,t,r){jam_search_suggestions.append(li({html:'<div class="icon-sprite-holder '+t+'-sprite"></div>'+bolden_keywords(decodeURI(e)),mouseover:spotlight_suggestion,mouseout:unspotlight_suggestion,"data-link":"/"+t+"/"+r,mousedown:function(){window.location.href=$(this).attr("data-link")}}))}function spotlight_suggestion(){$("#spotlight").attr("id",""),$(this).attr("id","spotlight")}function unspotlight_suggestion(){$(this).attr("id","")}function bolden_keywords(e){for(var t=jam_search_query.val().toLowerCase(),r=e.split(" "),a="",o=0;o<r.length;o++)a+=-1!==t.indexOf(r[o].toLowerCase())?"<b>"+r[o]+"</b>":r[o],a+=" ";return a}$("#bu-form-upload-picture").click(function(){pop(input({type:"file",change:evUploadPictureChange}))});var jam_manage_article_rows=$("#cp-table.manage-articles").find("tr");jam_manage_article_rows.find("td:first-child").on("contextmenu",articleContextMenu),jam_manage_article_rows.find("td:last-child").on("click",articleContextMenu),$("#bu-new-category").click(function(){pop(textinput({id:"new-name",maxlength:"40",placeholder:"New Category ...",style:"width:100%",keypress:keypressCategoryName})),$("#new-name").focus()});var jam_manage_category_rows=$("#cp-table.manage-categories").find("tr");jam_manage_category_rows.find("td:first-child").on("contextmenu",categoryContextMenu),jam_manage_category_rows.find("td:last-child").on("click",categoryContextMenu),$(".pictures-grid").find("div").click(function(){var e=this.style.backgroundImage;pop(img({src:e.replace(/^url\(["']?/,"").replace(/["']?\)$/,""),style:"width:auto;display:block;margin:auto;"}),"large")}),(_path_name.match(/^\/?$/)||_path_name.match(/home\.html$/))&&$(window).bind("scroll",evCheckHomeScroll),(skinTesting()||_path_name.match(/article\/create\/?$/)||_path_name.match(/\/edit\/?$/))&&($("textarea").autosize(),$(".x-article-category").chosen(),_path_name.match(/edit\/?$/)||_path_name.match(/edit-article\.html/)?$("#bu-remove-category").css("visibility","visible"):($("[data-published]").hide(),$("#ae-created").hide(),$("#ae-last-saved").hide()),$(".article-content").keyup(function(e){16===e.keyCode&&$.data(this,"shift-pressed",!1)}),$(".article-content").keydown(function(e){if(16===e.keyCode&&$.data(this,"shift-pressed",!0),9===e.keyCode){if($.data(this,"shift-pressed"))var t="\n	",r="\n";else var t="\n",r="\n	";var a=this.selectionStart,o=this.selectionEnd,i=$(this),n=i.val().substring(a,o),s=i.val().substring(0,a);if(s.match(new RegExp(t))){var c=s.lastIndexOf(t);s=s.substring(0,c)+r+s.substring(c+t.length)}else"\n	"===r&&(s="	"+s);return n=n.replace(new RegExp(t,"g"),r),i.val(s+n+i.val().substring(o)),this.selectionStart=this.selectionEnd=a+r.length-t.length,this.selectionStart=a,this.selectionEnd=o,!1}}),$("#bu-remove-category").click(function(){var e=categoryCount();return e>0&&(1===e&&$("#bu-remove-category").css("visibility","hidden"),$("#category-"+e).remove(),$("#category_"+e+"_chzn").remove(),decreaseCategory()),!1}),$("#bu-add-category").click(function(){var e=categoryCount()+1;return 1===e&&$("#bu-remove-category").css("visibility","visible"),$("#bu-remove-category").after($("#category-placeholder").first().clone(!1).attr("id","category-"+e).addClass("x-article-category").show()),$("#category-"+e).chosen(),increaseCategory(),!1}),$("#bu-preview-article").click(function(){var e=$(this);if(e.hasClass("color"))e.removeClass("color"),$("#article-preview").hide(),$("textarea.article-content").show();else{e.addClass("color");var t=$("textarea.article-content"),r=$("#article-preview");r.html(markDown(t.val())),t.hide(),r.show()}return!1}),$("#bu-save-article").click(function(){var e=$(this),t=e.attr("data-article-created").toString();return"false"===t?createArticle.call(this):"true"===t?saveArticle.call(this,urlArticleLink()):void 0})),(skinTesting()||_path_name.match(/^\/article\//))&&($("textarea").autosize(),evLoadComments(),$("#bu-post-comment").click(function(){var e=findCommentFormDetails($("#leave-comment"));return commentFormValidate(e)?(e.parent_comment_id="",go_ajax(_path_name+"/_comments","POST",e,function(t){t.created=cur_timestamp(),t.content=e.content,t.name=e.name,t.website=e.website,perfPostComment(t)}),void 0):!1}));var jam_search_query=$("#query"),jam_search_suggestions=$("#search-suggestions"),jam_cur_spotlight,previous_search="",search_cache={};jam_search_query.focus(function(){"Search"===this.value&&(this.value="",this.placeholder="Search")}),jam_search_query.blur(function(){""===this.value&&(this.value="Search",this.placeholder="")}),jam_search_suggestions.css("width",jam_search_query.width()+remove_px(jam_search_query.css("paddingLeft"))+remove_px(jam_search_query.css("paddingRight"))+remove_px(jam_search_query.css("borderLeftWidth"))+remove_px(jam_search_query.css("borderRightWidth"))+"px"),$("#search-form").submit(function(){var e=$("#spotlight").attr("data-link");return""!==this.query.value?void 0===e?!0:(window.location.href=e,!1):!1}),jam_search_query.keyup(function(e){arrowDown(e)?suggestionsDownKey():arrowUp(e)&&suggestionsUpKey();var t=jam_search_query.val();t!==previous_search&&(search_cache[previous_search]=jam_search_suggestions.children(),jam_search_suggestions.empty(),void 0!==search_cache[t]?jam_search_suggestions.append(search_cache[t]):search_suggest(t),previous_search=t),0===jam_search_suggestions.children().length?jam_search_suggestions.hide():jam_search_suggestions.show()}),jam_search_query.focus(function(){var e=jam_search_query.val();e!==previous_search&&(search_cache[previous_search]=jam_search_suggestions.children(),jam_search_suggestions.empty(),void 0!==search_cache[e]?jam_search_suggestions.append(search_cache[e]):search_suggest(e),previous_search=e)}),jam_search_query.blur(function(){search_cache[jam_search_query.val()]=jam_search_suggestions.children(),jam_search_suggestions.empty(),jam_search_suggestions.hide()});