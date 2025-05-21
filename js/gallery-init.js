var initPhotoSwipeFromDOM = function (gallerySelector) {
  var parseThumbnailElements = function (el) {
    var thumbElements = el.querySelectorAll('.project-gallery'),
      numNodes = thumbElements.length,
      items = [],
      figureEl,
      linkEl,
      size,
      item,
      projectItems;

    for (var i = 0; i < numNodes; i++) {
      figureEl = thumbElements[i];

      if (figureEl.nodeType !== 1) {
        continue;
      }

      // Get all gallery items for this project (visible + hidden)
      var mainLink = figureEl.querySelector('.gallery__link');
      var hiddenLinks = figureEl.querySelectorAll('.hidden-gallery-items a');
      var allLinks = [mainLink, ...Array.from(hiddenLinks)];

      allLinks.forEach(function(linkEl) {
        if (!linkEl) return;

        size = linkEl.getAttribute('data-size').split('x');
        item = {
          src: linkEl.getAttribute('href'),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10),
          projectId: figureEl.getAttribute('data-project-id')
        };

        if (linkEl.children.length > 0) {
          item.msrc = linkEl.children[0].getAttribute('src');
        }

        item.el = figureEl;
        items.push(item);
      });
    }

    return items;
  };

  var closest = function closest(el, fn) {
    return el && (fn(el) ? el : closest(el.parentNode, fn));
  };

  var onThumbnailsClick = function (e) {
    e = e || window.event;
    e.preventDefault ? e.preventDefault() : (e.returnValue = false);

    var eTarget = e.target || e.srcElement;

    var clickedListItem = closest(eTarget, function (el) {
      return el.classList && el.classList.contains('project-gallery');
    });

    if (!clickedListItem) {
      return;
    }

    var clickedGallery = clickedListItem.closest(gallerySelector),
      projectId = clickedListItem.getAttribute('data-project-id'),
      index = 0;

    // Find the index of the first image of this project
    var items = parseThumbnailElements(clickedGallery);
    for (var i = 0; i < items.length; i++) {
      if (items[i].projectId === projectId) {
        index = i;
        break;
      }
    }

    if (index >= 0) {
      openPhotoSwipe(index, clickedGallery);
    }
    return false;
  };

  var photoswipeParseHash = function () {
    var hash = window.location.hash.substring(1),
      params = {};

    if (hash.length < 5) {
      return params;
    }

    var vars = hash.split("&");
    for (var i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue;
      }
      var pair = vars[i].split("=");
      if (pair.length < 2) {
        continue;
      }
      params[pair[0]] = pair[1];
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10);
    }

    return params;
  };

  var openPhotoSwipe = function (
    index,
    galleryElement,
    disableAnimation,
    fromURL
  ) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
      gallery,
      options,
      items;

    items = parseThumbnailElements(galleryElement);

    // define options
    options = {
      showHideOpacity: true,
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),
      getThumbBoundsFn: function (index) {
        var thumbnail = items[index].el.getElementsByTagName('img')[0],
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      },
      // Prevent switching to other projects' images
      galleryPIDs: true,
      getDoubleTapZoom: function() {
        return 1;
      },
      filter: function(item, index) {
        return item.projectId === items[index].projectId;
      }
    };

    if (fromURL) {
      if (options.galleryPIDs) {
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j;
            break;
          }
        }
      } else {
        options.index = parseInt(index, 10) - 1;
      }
    } else {
      options.index = parseInt(index, 10);
    }

    if (isNaN(options.index)) {
      return;
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0;
    }

    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  };

  var galleryElements = document.querySelectorAll(gallerySelector);

  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }

  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};

initPhotoSwipeFromDOM('.my-gallery');
