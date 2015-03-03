// ==UserScript==
// @name        Codeforces comment sorter
// @grant       none
// @include http://codeforces.com/blog/entry*
// @include http://codeforces.ru/blog/entry*
// @require https://raw.githubusercontent.com/lodash/lodash/3.3.1/lodash.min.js
// ==/UserScript==


(function () {
    function print(o) {
        console.log(JSON.stringify(o));
    }

    function voteSum(comment) {
        var rating = comment.getElementsByClassName('commentRating')[0];
        return parseInt(rating.children[0].innerHTML);
    }

    //noinspection JSUnusedLocalSymbols
    function getId(comment) {
        return comment.getElementsByClassName('comment-table')[0].getAttribute('commentId');
    }

    function sortComments(element, parentId) {
        var comments = _.filter(element.getElementsByClassName('comment'), function (comment) {
            return !comment.classList.contains('comment-reply-prototype');
        });

        var topComments = _.filter(comments, function (comment) {
            return comment.outerHTML.indexOf('commentparentid="' + parentId + '"') != -1;
        });

        if (!topComments.length) {
            return;
        }

        var parentNode = topComments[0].parentNode;

        _.forEachRight(topComments, function (comment) {
            parentNode.removeChild(comment);
        });

        topComments.sort(function (a, b) {
            return voteSum(b) - voteSum(a);
        });

        _.forEach(topComments, function (comment) {
            parentNode.appendChild(comment);
        });
    }

    print('comment sorter started');
    sortComments(document, '-1');
    print('comment sorter finished');
})();