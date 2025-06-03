var initPhotoSwipeFromDOM = function (gallerySelector) {
  // Add image counters to all galleries
  var initGalleryIndicators = function() {
    document.querySelectorAll('.project-gallery').forEach(function(gallery) {
      // Remove any existing indicators
      gallery.querySelectorAll('.gallery__image-counter').forEach(function(el) {
        el.remove();
      });

      var mainImage = gallery.querySelector('.gallery__link');
      var hiddenImages = gallery.querySelectorAll('.hidden-gallery-items a');
      var totalImages = hiddenImages.length + 1;

      // Only add counter if there are multiple images
      if (totalImages > 1) {
        // Add counter
        var counter = document.createElement('div');
        counter.className = 'gallery__image-counter';
        counter.textContent = '1/' + totalImages;
        gallery.appendChild(counter);
      }
    });
  };

  var parseThumbnailElements = function (el) {
    var thumbElements = el.querySelectorAll('.project-gallery'),
      items = [];

    thumbElements.forEach(function(figureEl, galleryIndex) {
      if (figureEl.nodeType !== 1) {
        return;
      }

      // Set unique project ID if not already set
      if (!figureEl.getAttribute('data-project-id')) {
        figureEl.setAttribute('data-project-id', 'project-' + galleryIndex);
      }
      var projectId = figureEl.getAttribute('data-project-id');

      // Get all gallery items for this project (visible + hidden)
      var mainLink = figureEl.querySelector('.gallery__link');
      var hiddenLinks = figureEl.querySelectorAll('.hidden-gallery-items a');
      var allLinks = [mainLink, ...Array.from(hiddenLinks)];
      var figureParent = figureEl.closest('figure');
      var captionEl = figureParent.querySelector('figcaption');

      allLinks.forEach(function(linkEl, imageIndex) {
        if (!linkEl) return;

        var size = linkEl.getAttribute('data-size').split('x');
        var item = {
          src: linkEl.getAttribute('href'),
          w: parseInt(size[0], 10),
          h: parseInt(size[1], 10),
          projectId: projectId,
          imageIndex: imageIndex
        };

        if (linkEl.children.length > 0) {
          item.msrc = linkEl.children[0].getAttribute('src');
        }

        if (captionEl) {
          item.title = captionEl.innerHTML;
        }

        item.el = figureEl;
        items.push(item);
      });
    });

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

    var clickedGallery = clickedListItem.closest(gallerySelector);
    var projectId = clickedListItem.getAttribute('data-project-id');
    var items = parseThumbnailElements(clickedGallery);
    
    // Find all items for this project
    var projectItems = items.filter(function(item) {
      return item.projectId === projectId;
    });
    
    // Find the index within project items
    var index = projectItems.findIndex(function(item) {
      return item.el === clickedListItem;
    });

    if (index >= 0) {
      // Open PhotoSwipe with filtered items
      openPhotoSwipe(index, clickedGallery, false, false, projectItems);
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
    fromURL,
    projectItems
  ) {
    var pswpElement = document.querySelectorAll('.pswp')[0],
      gallery,
      options;

    // Use provided project items or get all items
    var items = projectItems || parseThumbnailElements(galleryElement);
    
    // If no project items provided, filter by clicked project
    if (!projectItems) {
      var firstItem = items[index];
      items = items.filter(function(item) {
        return item.projectId === firstItem.projectId;
      });
      // Adjust index for filtered items
      index = 0;
    }

    options = {
      showHideOpacity: true,
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),
      getThumbBoundsFn: function (index) {
        var thumbnail = items[index].el.getElementsByTagName('img')[0],
          pageYScroll = window.pageYOffset || document.documentElement.scrollTop,
          rect = thumbnail.getBoundingClientRect();

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      },
      getDoubleTapZoom: function() {
        return 1;
      },
      index: index
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
    }

    gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    
    // Update counter when image changes
    gallery.listen('afterChange', function() {
      var currentIndex = gallery.getCurrentIndex();
      var currentItem = items[currentIndex];
      var galleryEl = currentItem.el;
      
      // Update counter
      var counter = galleryEl.querySelector('.gallery__image-counter');
      if (counter) {
        counter.textContent = (currentIndex + 1) + '/' + items.length;
      }
    });

    gallery.init();
  };

  // Initialize indicators for all galleries
  initGalleryIndicators();

  var galleryElements = document.querySelectorAll(gallerySelector);
  
  for (var i = 0, l = galleryElements.length; i < l; i++) {
    galleryElements[i].setAttribute('data-pswp-uid', i + 1);
    galleryElements[i].onclick = onThumbnailsClick;
  }

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  var hashData = photoswipeParseHash();
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true);
  }
};

// Initialize galleries when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initPhotoSwipeFromDOM('.my-gallery');
});
