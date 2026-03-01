var soto;
(function($) {
  "use strict";
  soto = (function() {
    return {
      init: function() {
        // Header
        this.promotionalMessage();
        this.fixedHeader();
        this.headerSearch();
        this.cart();
        this.cartUpsell();
        this.popupNewsletter();
        this.mobileMenu();

        // Footer
        this.parallaxFooter();

        // Home
        this.slideshow();
        this.shopPlants();
        this.exploreCollectionProducts();
        this.lookbook();
        this.brands();
        this.latestNews();
        this.faq();

        // Blog
        this.blog();

        // Account
        this.account();

        // Search
        this.search();

        // Collection
        this.collection();
        this.collectionFilter();
        this.collectionSlider();
        this.collectionSlider2();

        // Product
        if($(".product-template").length > 0) {
          this.productImages();
          this.productAddToBag();
          this.productForm();
          this.upsellProduct();
          this.relatedProducts();
          this.productBundlePurchase();
          //this.stickyAddToCart();
        }
        this.productQuantity();
        this.productRequiredEnquiry();

        // Utilities
        this.video();
        this.accordion();
        this.choosenSelect();
        this.aos();
        this.matchHeight();
      },

      // Header
      promotionalMessage: function() {
        $('.js-carousel-promotional-message').owlCarousel({
          loop: true,
          margin: 8,
          nav: false,
          items: 1,
          autoplay: true
        })
      },

      fixedHeader: function() {
        var headerHeight = 0;
        $(window).scroll(function() {
          var scrollTop = $(window).scrollTop();
          if(scrollTop > $(".js-promotional-message").outerHeight()) { 
            if(headerHeight == 0) {
              headerHeight = $(".js-header-container").outerHeight();
            }
            $(".js-header").css("height", headerHeight).addClass("fixed");
          } else {
            $(".js-header").removeClass("fixed");
          }
        });
      },

      headerSearch: function() {
        $(".js-open-search").click(function () {
          $(".js-search").toggleClass("active");
          return false;
        });
        $(".js-search-counter").each(function () {
          var href = $(this).attr("data-url");
          $(this).load(href + ' #search-counter', function() {

          });
        });
      },

      cart: function() {
        $("body").on("click", ".js-open-cart", function () {
          $(".js-cart").addClass("active");
          return false;
        });
        $("body").on("click", ".js-close-cart", function () {
          $(".js-cart").removeClass("active");
          return false;
        });
        $("body").on("click", ".js-change-quantity", function () {
          var quantity = parseInt($(this).attr("data-quantity"));
          var id = parseInt($(this).attr("data-variant-id"));
          $(".js-cart").addClass("is-loading");
          $.ajax({
            type: 'POST',
            url: '/cart/change.js',
            dataType: 'json',
            data: { id: id, quantity: quantity },
            success: function() {
              soto.refreshCart();
            },
            error: function(response) {
              var errorMessage = response.responseJSON
                ? response.responseJSON.description
                : theme.strings.cartError;
              alert(errorMessage);
              soto.refreshCart();
            }
          });
          return false;
        });
        $("body").on("click", ".js-cart-note-switcher", function () {
          if($(".js-cart-note-switcher").is(":checked")) {
            $(".js-cart-note").removeClass("d-none");
          } else {
            $(".js-cart-note").addClass("d-none");
          }
        });
      },

      cartUpsell: function() {
        $(".js-carousel-upsell-cart-products").owlCarousel({
          loop: true,
          margin: 25,
          nav: true,
          navText: ['<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>', '<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>'],
          dots: false,
          items: 4,
          autoplay: false,
          responsive: {
            0:{
              items: 2
            },
            410: {
              items: 3
            },
            768:{
              items: 4
            }
          }
        }).on("dragged.owl.carousel", function (event) {
          $('.js-carousel-upsell-cart-products .owl-next').removeClass("active");
        });
        $('body').on('animationend webkitAnimationEnd oAnimationEnd', '.js-carousel-upsell-cart-products .owl-next svg circle', function () {
          $('.js-carousel-upsell-cart-products').trigger('next.owl.carousel');
          $('.js-carousel-upsell-cart-products .owl-next').removeClass("active");
          setTimeout(function () {
            $('.js-carousel-upsell-cart-products .owl-next').addClass("active");
          }, 50);
        });
        $('body').on('click', '.js-carousel-upsell-cart-products .owl-next, .js-carousel-upsell-cart-products .owl-prev', function () {
          $('.js-carousel-upsell-cart-products .owl-next').removeClass("active");
        });
        setTimeout(function () {
          $(".js-carousel-upsell-cart-products .owl-next").addClass("active");
        }, 200);
      },

      popupNewsletter: function() {
        if($(".js-popup-newsletter").length > 0) {
          if(!$.cookie('newsletter')) {
            setTimeout(function () {
              $(".js-popup-newsletter").addClass("active");
            }, $(".js-popup-newsletter").attr("data-show-after"));
          } else {
            $(".js-popup-newsletter").hide();
          }

          $(".js-close-popup-newsletter").click(function () {
            $.cookie('newsletter', 'true', { expires : 72000 });
            $(".js-popup-newsletter").removeClass("active");
            return false;
          });
        }
      },

      mobileMenu: function() {
        $(".js-open-mobile-menu").click(function () {
          if($(".js-mobile-menu").hasClass("active")) {
            $(".js-mobile-menu").removeClass("active");
            $(".js-icon-open-menu").removeClass("d-none");
            $(".js-icon-close-menu").addClass("d-none");
          } else {
            $(".js-mobile-menu").addClass("active");
            $(".js-icon-open-menu").addClass("d-none");
            $(".js-icon-close-menu").removeClass("d-none");
          }
          return false;
        });
        $(".js-open-mobile-menu-second-level").click(function (e) {
          var width = $(this).outerWidth() * 0.8;
          var clickedPosition = e.pageX - $(this).offset().left;
          if(clickedPosition > width) {
            var id = $(this).attr("data-id");
            $(".js-mobile-menu-first-level").addClass("d-none");
            $(".js-mobile-menu-second-level").addClass("d-none");
            $(".js-mobile-menu-second-level[data-id='" + id + "']").removeClass("d-none");          
            return false;
          }
        });
        $(".js-go-to-mobile-menu-first-level").click(function () {
          $(".js-mobile-menu-first-level").removeClass("d-none");
          $(".js-mobile-menu-second-level").addClass("d-none");
          return false;
        });
        $(".js-open-mobile-sub-menu").click(function (e) {
          var width = $(this).outerWidth() * 0.8;
          var clickedPosition = e.pageX - $(this).offset().left;
          if(clickedPosition > width) {
            $(".js-open-mobile-sub-menu").removeClass("active");
            $(this).addClass("active");
            $(".js-mobile-sub-menu").addClass("d-none");
            $(this).parent().find(".js-mobile-sub-menu").removeClass("d-none");
            return false;
          }
        });
      },

      // Footer
      parallaxFooter: function() {
        $(window).scroll(function() {
          var scrollTop = $(window).scrollTop() + $(window).outerHeight();
          if(scrollTop > $(".js-footer-parallax-space").offset().top) { 
            $(".js-footer-parallax").addClass("active");
          } else {
            $(".js-footer-parallax").removeClass("active");
          }
        });
      },

      // Home
      slideshow: function() {
        $('.js-slideshow').owlCarousel({
          items: 1,
          margin: 0,
          nav: true,
          loop: false,
          navText: ['<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>', '<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>'],
          animateOut: 'fadeOut',
          animateIn: 'fadeIn'
        }).on("dragged.owl.carousel", function (event) {
          $('.js-slideshow .owl-next').removeClass("active");
        });
        $('body').on('animationend webkitAnimationEnd oAnimationEnd', '.js-slideshow .owl-next svg circle', function () {
          $('.js-slideshow').trigger('next.owl.carousel');
          $('.js-slideshow .owl-next').removeClass("active");
          setTimeout(function () {
            $('.js-slideshow .owl-next').addClass("active");
          }, 50);
        });
        $('body').on('click', '.js-slideshow .owl-next, .js-slideshow .owl-prev', function () {
          $('.js-slideshow .owl-next').removeClass("active");
        });
        setTimeout(function () {
          $(".js-slideshow .owl-next").addClass("active");
        }, 200);
      },

      shopPlants: function() {
        var currentImage = 1;
        $('.js-carousel-shop-plants').owlCarousel({
          loop: false,
          margin: 0,
          nav: false,
          items: 1,
          autoplay: false,
          animateOut: 'fadeOut',
          animateIn: 'fadeIn'
        });
        $(".js-shop-plants-item").hover(function () {
          var dataId = $(this).attr("data-id");
          $(".js-shop-plants-item").removeClass("active");
          $(this).addClass("active");
          if(dataId != currentImage) {
            currentImage = dataId;
            $('.js-carousel-shop-plants').trigger('to.owl.carousel', dataId - 1);
          }
        });
      },

      exploreCollectionProducts: function() {
        $(".js-explore-collection-products").owlCarousel({
          loop: true,
          margin: 24,
          nav: true,
          navText: ['<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>', '<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>'],
          items: 3,
          autoplay: false,
          responsive: {
            0:{
              items:1
            },
            992: {
              items: 2
            },
            1099: {
              items: 3
            }
          }
        }).on("dragged.owl.carousel", function (event) {
          $('.js-explore-collection-products .owl-next').removeClass("active");
        });
        $('body').on('animationend webkitAnimationEnd oAnimationEnd', '.js-explore-collection-products .owl-next svg circle', function () {
          $('.js-explore-collection-products').trigger('next.owl.carousel');
          $('.js-explore-collection-products .owl-next').removeClass("active");
          setTimeout(function () {
            $('.js-explore-collection-products .owl-next').addClass("active");
          }, 50);
        });
        $('body').on('click', '.js-explore-collection-products .owl-next, .js-explore-collection-products .owl-prev', function () {
          $('.js-explore-collection-products .owl-next').removeClass("active");
        });
        setTimeout(function () {
          $(".js-explore-collection-products .owl-next").addClass("active");
        }, 200);
      },

      lookbook: function() {
        $('.js-carousel-lookbook-products').owlCarousel({
          loop: false,
          margin: 24,
          nav: false,
          dots: true,
          items: 1,
          autoplay: false
        });
        $(".js-lookbook-pin").click(function () {
          if($(window).outerWidth() > 767) {
            var dataId = $(this).attr("data-id");
            $('.js-carousel-lookbook-products').trigger('to.owl.carousel', dataId - 1)
            return false;
          } else {
            var dataId = $(this).attr("data-id");
            $('.js-carousel-lookbook-products').trigger('to.owl.carousel', dataId - 1);
            $(".js-lookbook-mobile-products").addClass("active");    
            $("html, body").animate({ scrollTop: $(".js-lookbook-mobile-products").offset().top - 100 }, "500");
            return false;
          }
        });
      }, 

      brands: function() {
        $('.js-brands-carousel').owlCarousel({
          loop: true,
          margin: 24,
          nav: false,
          dots: false,
          items: 5,
          autoplay: true,
          responsive: {
            0:{
              items: 2
            },
            768:{
              items: 3
            },
            992: {
              items: 4
            },
            1099: {
              items: 5
            }
          }
        });
      },

      latestNews: function() {
        $(".js-carousel-latest-news").owlCarousel({
          loop: true,
          margin: 24,
          nav: true,
          navText: ['<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>', '<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>'],
          items: 3,
          autoplay: false,
          responsive: {
            0:{
              items:1
            },
            992: {
              items: 2
            },
            1099: {
              items: 3
            }
          }
        }).on("dragged.owl.carousel", function (event) {
          $('.js-carousel-latest-news .owl-next').removeClass("active");
        });
        $('body').on('animationend webkitAnimationEnd oAnimationEnd', '.js-carousel-latest-news .owl-next svg circle', function () {
          $('.js-carousel-latest-news').trigger('next.owl.carousel');
          $('.js-carousel-latest-news .owl-next').removeClass("active");
          setTimeout(function () {
            $('.js-carousel-latest-news .owl-next').addClass("active");
          }, 50);
        });
        $('body').on('click', '.js-carousel-latest-news .owl-next, .js-carousel-latest-news .owl-prev', function () {
          $('.js-carousel-latest-news .owl-next').removeClass("active");
        });
        setTimeout(function () {
          $(".js-carousel-latest-news .owl-next").addClass("active");
        }, 200);
      },


      faq: function() {
        $('.js-faq-carousel').owlCarousel({
          loop: true,
          margin: 50,
          nav: false,
          dots: true,
          items: 1,
          autoplay: false,
        });
      },

      // Blog
      blog: function() {
        $(window).scroll(function() {
          if($(".js-blog-next-page").length > 0) {
            var scrollTop = $(window).scrollTop();
            if(scrollTop > $(".js-blog-next-page").offset().top - $(window).outerHeight() - 100) { 
              var href = $(".js-blog-next-page").attr("data-href");
              $(".js-blog-next-page").remove();
              $.ajax({
                url: href,
                type: 'GET'
              }).done(function(data) {
                $('.js-blog-row').append($(data).find('.js-blog-row').html());
              })
            }
          }
        });
      },

      // Account
      account: function() {
        $(".js-go-to-forgotten-password").click(function () {
          $(".js-login").addClass("d-none");
          $(".js-forgotten-password").removeClass("d-none");
          return false;
        });
        $(".js-back-to-login").click(function () {
          $(".js-login").removeClass("d-none");
          $(".js-forgotten-password").addClass("d-none");
          return false;
        });
      },

      // Search
      search: function() {
        $(window).scroll(function() {
          if($(".js-search-next-page").length > 0) {
            var scrollTop = $(window).scrollTop();
            if(scrollTop > $(".js-search-next-page").offset().top - $(window).outerHeight() - 100) { 
              var href = $(".js-search-next-page").attr("data-href");
              $(".js-search-next-page").remove();
              $.ajax({
                url: href,
                type: 'GET'
              }).done(function(data) {
                $('.js-search-row').append($(data).find('.js-search-row').html());
              })
            }
          }
        });
      },

      // Collection
      collection: function() {
        $(window).scroll(function() {
          if($(".js-collection-next-page").length > 0) {
            var scrollTop = $(window).scrollTop();
            if(scrollTop > $(".js-collection-next-page").offset().top - $(window).outerHeight() - 100) { 
              var href = $(".js-collection-next-page").attr("data-href");
              $(".js-collection-next-page").remove();
              $.ajax({
                url: href,
                type: 'GET'
              }).done(function(data) {
                $('.js-collection-row').append($(data).find('.js-collection-row').html());
              })
            }
          }
        });
        $(document.body).on('click', '.js-facets-summary', function() {
          var index = $(this).attr("data-index");
          $(".js-collection-filter").toggleClass("active-" + index);
        });
        $(document.body).on('click', '.js-open-mobile-filter', function() {
          $(".js-collection-filter").addClass("active-mobile-filter");
          $("body").addClass("active-filter");
        });
        $(document.body).on('click', '.js-close-mobile-filter', function() {
          $(".js-collection-filter").removeClass("active-mobile-filter");
          $("body").removeClass("active-filter");
        });
      },

      collectionFilter: function() {
        Shopify.queryParams = {};
        Shopify.queryParams.sort_by = $(".js-collection-sort-by").val();
        var tags = [];
        $("input.tag").each(function () {
          if($(this).is(":checked")) {
            tags.push($(this).attr("value"));
          }
        });
        Shopify.queryParams.constraint = tags.join("+");

        function filterCreateUrl() {
          if(Shopify.queryParams.constraint == '') {
            return $(".js-collection-items").attr("data-url") + "?sort_by=" + Shopify.queryParams.sort_by;
          } else {
            return $(".js-collection-items").attr("data-url") + "/" + Shopify.queryParams.constraint + "?sort_by=" + Shopify.queryParams.sort_by;
          }
        }

        function filterGetContent(url) {
          $.ajax({
            type: "get",
            url: url,
            beforeSend: function() {
              $(".js-collection").addClass("loading");
            },
            success: function(result) {
              var title = result.match("<title>(.*?)</title>")[1];
              History.pushState({
                param: Shopify.queryParams
              }, title, url);
              $(".js-collection").html($(result).find(".js-collection").html());
              $(".js-collection").removeClass("loading");
            },
            error: function() {
              $(".js-collection").removeClass("loading");
            }
          })
        }

        $("input.tag").change(function () {
          var tags = [];
          $("input.tag").each(function () {
            if($(this).is(":checked")) {
              tags.push($(this).attr("value"));
            }
          });
          Shopify.queryParams.constraint = tags.join("+");
          filterGetContent(filterCreateUrl());
          return false;
        });

        $("body").on("change", ".js-collection-sort-by", function(y) {
          Shopify.queryParams.sort_by = $(".js-collection-sort-by").val();
          filterGetContent(filterCreateUrl());
          return false;
        });

        $("body").on("click", ".js-reset-filters", function(y) {
          var tags = [];
          $("input.tag").each(function () {
            $(this).prop('checked', false);
          });
          Shopify.queryParams.constraint = tags.join("+");
          filterGetContent(filterCreateUrl());
          return false;
        });
      },
      collectionSlider: function() {
        $('.blog-category__image_slider').owlCarousel({
          loop: true,
          margin: 0,
          items: 1,
          dots: true,
          nav : true,
          responsive: {
             0:{
              items:1,
              margin:15,
              nav : false,
            },
            560:{
              items:1,
            }
          }
        });
      },
      collectionSlider2: function() {
        $('.garden-home-slider').owlCarousel({
           items:5,            // Number of items to show
    loop: true,              // Infinite loop
    autoplay: true,          // Autoplay on
    autoplayTimeout: 3000,   // Autoplay speed (ms)
    autoplaySpeed: 3000,     // Speed of transition (ms) - match with timeout for smoothness
    slideTransition: 'linear', // Smooth linear transition
    autoplayHoverPause: true,
   responsive: {
            0:{
              items:2,
            },
            768:{
              items:3,
            },
            991:{
              items:4,
            },
            1100:{
              items:4.5,
            }
          }
        });
      },
      // Product
      productImages: function() {
        $('.js-slider-product-thumbnails').slick({
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: true,
          dots: false,
          vertical: true,
          verticalSwiping: true,
          responsive: [
            {
              breakpoint: 1199,
              settings: {
                slidesToShow: 4
              }
            },
            {
              breakpoint: 1098,
              settings: {
                slidesToShow: 3
              }
            }
          ]
        });
        $(".js-thumbnail-item").click(function () {
          var index = $(this).attr("data-index");
          $(".js-thumbnail-item").removeClass("active");
          $(this).addClass("active");
          $(".js-main-image").removeClass("active");
          $(".js-main-image[data-index='" + index + "']").addClass("active");
          return false;
        });
        $(".js-product-mobile-images").owlCarousel({
          loop: true,
          margin: 20,
          nav: false,
          dots: true,
          items: 1,
          autoplay: false,
          responsive: {
            0:{
              margin: 15
            },
            768:{
              margin: 20
            }
          }
        });
      },

      productAddToBag: function() {
        $(window).scroll(function() {
          var scrollTop = $(window).scrollTop();
          if(scrollTop > $(".js-product-template").offset().top + $(".js-product-template").outerHeight()) {
            $(".js-scroll-to-top").addClass("active");
          } else {
            $(".js-scroll-to-top").removeClass("active");
          }
        });
        $(".js-scroll-to-top").click(function () {
          $("html, body").animate({ scrollTop: 0 }, "500");
          return false;
        });
      },

      productQuantity: function() {
        $(".js-quantity-up").click(function () {
          var q_val_up = parseInt($(this).parent().find("input").val());
          if(isNaN(q_val_up)) {
            q_val_up = 0;
          }
          $(this).parent().find("input").val(q_val_up+1).keyup(); 
          return false;
        });
        
        $(".js-quantity-down").click(function () {
          var q_val_up = parseInt($(this).parent().find("input").val());
          if(isNaN(q_val_up)) {
            q_val_up = 0;
          }
          if(q_val_up > 1) {
            $(this).parent().find("input").val(q_val_up-1).keyup(); 
          }
          return false;
        });
      },

      productRequiredEnquiry: function() {
        $(".js-go-to-contact").click(function () {
          localStorage.setItem('contactMessage', $(this).attr("data-message"));
        });
        $(".js-contact-message").val(localStorage.getItem('contactMessage'));
        localStorage.setItem('contactMessage', '');
      },  

      productForm: function() {
        function variants() {
          var data = JSON.parse(document.getElementById('ProductJson').innerHTML);
          var discountData = document.getElementById('ProductDiscountData') ? JSON.parse(document.getElementById('ProductDiscountData').innerHTML) : null;
          var selectCallback = function(variant, selector) {
            var that = $(".product-template");
            if (variant) {
              if (variant.available) {
                $(that).find(".product-template__add-to-cart").removeClass("d-none");
                $(that).find(".product-template__out-of-stock").addClass("d-none");
              } else {
                $(that).find(".product-template__add-to-cart").addClass("d-none");
                $(that).find(".product-template__out-of-stock").removeClass("d-none");
              }
              // Check if discount percentage metafield exists
              var discountPercentage = discountData && discountData.discount_percentage;
              
              if(discountPercentage) {
                // Calculate discounted price (25% off original)
                var discountDisplay = Math.round(discountPercentage * 100) / 100;
                if(discountDisplay === Math.round(discountDisplay)) {
                  discountDisplay = Math.round(discountDisplay);
                }
                var oneMinusDiscount = 100 - discountPercentage;
                var discountedPrice = Math.round((variant.price * oneMinusDiscount) / 100);
                
                $(that).find(".price__new").html(Shopify.formatMoney(discountedPrice).replace('.00', ''));
                $(that).find(".price__compare_price").removeClass("d-none").html(Shopify.formatMoney(variant.price).replace('.00', ''));
                $(that).find(".price__discount-badge").removeClass("d-none").html(discountDisplay + "% OFF");
                $(that).find(".price__old").addClass("d-none");
              } else if(variant.compare_at_price > variant.price) {
                $(that).find(".price__old").removeClass("d-none").html(Shopify.formatMoney(variant.compare_at_price).replace('.00', ''));
                $(that).find(".price__new").html(Shopify.formatMoney(variant.price).replace('.00', ''));
                $(that).find(".price__compare_price").addClass("d-none");
                $(that).find(".price__discount-badge").addClass("d-none");
              } else {
                $(that).find(".price__old").addClass("d-none");
                $(that).find(".price__new").html(Shopify.formatMoney(variant.price).replace('.00', ''));
                $(that).find(".price__compare_price").addClass("d-none");
                $(that).find(".price__discount-badge").addClass("d-none");
              }
              if(variant.featured_image !== null) {
                $(".js-thumbnail-item[data-index='" + variant.featured_image.position + "']").click();
                $(".js-product-mobile-images").trigger('to.owl.carousel', variant.featured_image.position-1)
              }
            } else {
              $(that).find(".product-template__add-to-cart").addClass("d-none");
              $(that).find(".product-template__out-of-stock").removeClass("d-none");
            }
          }
          jQuery(function($) {
            if($("#product-select").length > 0) {
              new Shopify.OptionSelectors("product-select", { product: data , onVariantSelected: selectCallback, enableHistoryState: true });
            }
          });
        }

        variants();

        $(".js-open-options").click(function () {
          var id = $(this).attr("data-id");
          $(".js-option[data-id='" + id + "']").toggleClass("active");
        });

        $(".js-option-value").click(function () {
          var id = $(this).parent().attr("data-id");
          var value = $(this).attr("data-value");
          var option = $(".js-options[data-id='" + id + "']").attr("data-option");
          $(".js-open-options[data-id='" + id + "']").html($(this).html());
          $(".js-option[data-id='" + id + "']").removeClass("active");
          $(".product-template #product-variants select[data-option='" + option + "']").val(value).change();
          return false;
        });

        $(".js-notify-me").click(function () {
          $(".bis-button").click();
          return false;
        });

        $("body").on("click", ".js-add-to-cart", function () {
          var quantity = 1;
          var id = parseInt($(this).attr("data-variant-id"));
          $(this).addClass("is-loading");
          $.ajax({
            type: 'POST',
            url: '/cart/add.js',
            dataType: 'json',
            data: { id: id, quantity: quantity },
            success: function() {
              soto.refreshCart();
            },
            error: function(response) {
              var errorMessage = response.responseJSON
                ? response.responseJSON.description
                : theme.strings.cartError;
              alert(errorMessage);
              soto.refreshCart();
            }
          });
          return false;
        });


        // ############################################################################
        // ######
        // ######
        // ######                 TEST !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // ######
        // ######

        $("body").on("click", ".js-add-to-bag", function () {
          if (!$('.js-add-to-bag').hasClass('add-to-cart_pop')){
            var quantity = $(".add-to-cart__quantity input[type='number']").val();
            var id = $("#product-select").val();
            $(this).addClass("is-loading");
            $.ajax({
              type: 'POST',
              url: '/cart/add.js',
              dataType: 'json',
              data: { id: id, quantity: quantity },
              success: function(response) {
                soto.refreshCart();
              },
              error: function(response) {
                var errorMessage = response.responseJSON
                  ? response.responseJSON.description
                  : theme.strings.cartError;
                alert(errorMessage);
                soto.refreshCart();
              }
            });
            return false;
          }
        });
      },

      upsellProduct: function() {
        $(".js-carousel-upsell-products").owlCarousel({
          loop: false ,
          margin: 15,
          nav: true,
          navText: ['<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>', '<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>'],
          dots: false,
          items: 4, //$(".js-carousel-upsell-products").data('item') ? $(".js-carousel-upsell-products").data('item') : 4,
          autoplay: false,
          responsive: {
            0:{
              items: 3,
              margin: 10
            },
            768:{
              items: 5
            },
            992:{
              items: 3
            },
            1099: {
              items: $(".js-carousel-upsell-products").data('item') ? $(".js-carousel-upsell-products").data('item') : 4
            }
          }
        }).on("dragged.owl.carousel", function (event) {
          $('.js-carousel-upsell-products .owl-next').removeClass("active");
        });
        $('body').on('animationend webkitAnimationEnd oAnimationEnd', '.js-carousel-upsell-products .owl-next svg circle', function () {
          $('.js-carousel-upsell-products').trigger('next.owl.carousel');
          $('.js-carousel-upsell-products .owl-next').removeClass("active");
          setTimeout(function () {
            $('.js-carousel-upsell-products .owl-next').addClass("active");
          }, 50);
        });
        $('body').on('click', '.js-carousel-upsell-products .owl-next, .js-carousel-upsell-products .owl-prev', function () {
          $('.js-carousel-upsell-products .owl-next').removeClass("active");
        });
        setTimeout(function () {
          $(".js-carousel-upsell-products .owl-next").addClass("active");
        }, 200);
		

        $(".js-carousel-deactivate").owlCarousel({
          loop: $(".js-carousel-deactivate").data('loop') ? false : true,
          margin: 25,
          nav: true,
          navText: ['<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>', '<svg><circle class="outer" cx="16" cy="16" r="16" transform="rotate(-90, 16, 16)"></circle></svg>'],
          dots: false,
          items: 4, //$(".js-carousel-upsell-products").data('item') ? $(".js-carousel-upsell-products").data('item') : 4,
          autoplay: false,
          responsive: {
            0:{
              items: 3
            },
            768:{
              items: 5
            },
            992:{
              items: 3
            },
            1099: {
              items: $(".js-carousel-deactivate").data('item') ? $(".js-carousel-upsell-products").data('item') : 4
            }
          }
        }).on("dragged.owl.carousel", function (event) {
          $('.js-carousel-upsell-products .owl-next').removeClass("active");
        });
        $('body').on('animationend webkitAnimationEnd oAnimationEnd', '.js-carousel-deactivate .owl-next svg circle', function () {
          $('.js-carousel-deactivate').trigger('next.owl.carousel');
          $('.js-carousel-deactivate .owl-next').removeClass("active");
          setTimeout(function () {
            $('.js-carousel-deactivate .owl-next').removeClass("active");
          }, 50);
        });
        $('body').on('click', '.js-carousel-deactivate .owl-next, .js-carousel-deactivate .owl-prev', function () {
          $('.js-carousel-deactivate .owl-next').removeClass("active");
        });
        setTimeout(function () {
          $(".js-carousel-deactivate .owl-next").removeClass("active");
        }, 200);		
		
		
		
      },

      relatedProducts: function() {
        if($(".product-recommendations").length > 0) {
          loadRelatedProducts();
        }
        function loadRelatedProducts() {
          var productRecommendationsSection = document.querySelector(".product-recommendations");
          if (productRecommendationsSection === null) { return; }
          var productId = $(".product-recommendations").attr("data-product-id");
          var limit = $(".product-recommendations").attr("data-limit");
          var requestUrl = "/recommendations/products?section_id=related_products&limit="+limit+"&product_id="+productId;
          var request = new XMLHttpRequest();
          request.open("GET", requestUrl);
          request.onload = function() {
            if (request.status >= 200 && request.status < 300) {
              var container = document.createElement("div");
              container.innerHTML = request.response;
              productRecommendationsSection.parentElement.innerHTML = container.querySelector(".product-recommendations").innerHTML;
              soto.exploreCollectionProducts();
            }
          };
          request.send();
        }
      },

      productBundlePurchase: function() {
        $("body").on("click", ".js-add-bundle-to-cart", function () {
          var $button = $(this);
          var plantVariantId = $("#product-select").val();
          var upsellVariantIds = $button.attr("data-upsell-variant-ids");
          var quantity = parseInt($button.closest('.add-to-cart__button').siblings('.add-to-cart__quantity').find('input[type="number"]').val()) || 1;
          
          $button.addClass("is-loading");
          
          soto.addBundleToCart(plantVariantId, upsellVariantIds, quantity, function() {
            $button.removeClass("is-loading");
          });
          
          return false;
        });

        $("body").on("change", ".js-upsell-checkbox", function () {
          soto.updateUpsellVariantIds();
        });
      },

      

      updateUpsellVariantIds: function() {
        var selectedVariantIds = [];
        
        $(".js-upsell-checkbox:checked").each(function() {
          var variantId = $(this).attr("data-variant-id");
          var variantPrice = $(this).attr("data-price");
          if (variantId) {
            selectedVariantIds.push(variantId);
          }
        });
        
        var upsellIdsString = selectedVariantIds.join(',');
        
        if ($(".js-add-bundle-to-cart").length > 0) {
          $(".js-add-bundle-to-cart").attr("data-upsell-variant-ids", upsellIdsString);
        }
        
        if ($(".add-to-cart_pop").length > 0) {
          $(".add-to-cart_pop").attr("data-id", upsellIdsString);
        }
        
        soto.updateAddToCartButtonText(selectedVariantIds.length);
      },

      // updateAddToCartButtonText: function(count) {
      //   var $button = $(".add-to-cart_pop");
      //   if ($button.length > 0) {
      //     if (count > 0) {
      //       $button.text("Add plant & " + count + " upsell" + (count > 1 ? "s" : "") + " to bag");
      //     } else {
      //       $button.text("Add plant to bag");
      //     }
      //   }
      // },

      addBundleToCart: function(plantVariantId, upsellVariantIds, quantity, callback) {
        var items = [];
        
        if (plantVariantId) {
          items.push({
            id: parseInt(plantVariantId),
            quantity: quantity
          });
        }
        
        if (upsellVariantIds) {
          var upsellIds = [];
          
          if (typeof upsellVariantIds === 'string') {
            if (upsellVariantIds.indexOf(',') !== -1) {
              upsellIds = upsellVariantIds.split(',');
            } else if (upsellVariantIds !== '') {
              upsellIds = [upsellVariantIds];
            }
          } else if (Array.isArray(upsellVariantIds)) {
            upsellIds = upsellVariantIds;
          }
          
          upsellIds.forEach(function(variantId) {
            var trimmedId = String(variantId).trim();
            if (trimmedId !== '') {
              items.push({
                id: parseInt(trimmedId),
                quantity: 1
              });
            }
          });
        }
        
        if (items.length === 0) {
          if (callback) callback();
          return;
        }
        
        $.ajax({
          type: 'POST',
          url: '/cart/add.js',
          dataType: 'json',
          data: { items: items },
          success: function(response) {
            soto.refreshCart();
            if (callback) callback();
          },
          error: function(response) {
            var errorMessage = response.responseJSON
              ? response.responseJSON.description
              : theme.strings.cartError;
            alert(errorMessage);
            soto.refreshCart();
            if (callback) callback();
          }
        });
      },

      // Utilities
      video: function() {
        $('.js-youtube-video').youtube_background();
        $('.js-vimeo-video').vimeo_player();
        if($('.js-video').length > 0) {
          $(".js-video").each(function () {
            this.controls = false;
            $(this).get(0).play();
          });
        }
        $(".js-open-standard-video a").click(function () {
          $(this).parent().parent().addClass("active");
          return false;
        });
      },

      accordion: function() {
        $(".js-accordion-title").click(function() {
          $(this).parent().parent().find(".js-accordion-faq").removeClass("current");
          $(this).parent().toggleClass("active").addClass("current");
          $(this).parent().parent().find(".js-accordion:not(.current).active .js-accordion-content").slideToggle(500);
          $(this).parent().parent().find(".js-accordion:not(.current).active").removeClass("active");
          $(this).parent().find(".js-accordion-content").slideToggle(500);
        });
        $(".js-accordion.active").each(function () {
          $(this).find(".js-accordion-content").slideToggle(500);
        });
      },

      choosenSelect: function() {
        $(".js-collection-sort-by").chosen();
      },

      refreshCart: function() {
        $('#cart-content').load('/cart #cart-content', function() {
          $(".js-cart").addClass("active");
          $(".js-add-to-cart, .js-add-to-bag, .js-cart").removeClass("is-loading");
          soto.cartUpsell();
          soto.matchHeight();
        });
        jQuery.getJSON('/cart.js', function(cart) {
          $('.js-cart-item-count').html(cart.item_count).attr("data-count", cart.item_count);
        });
      },

      aos: function() {
        AOS.init();
      },

      matchHeight: function() {
        $(".js-match-height-upsell-item").matchHeight();
      }
    }
  })();
})(jQuery);

$(document).ready(function() {
  soto.init();
});

if (window.Shopify.designMode) {
  jQuery(document)
    .on('shopify:section:load', function() {
      soto.init();
    }).on('shopify:section:unload', function() {
      soto.init();
    }).on('shopify:section:select', function() {
      soto.init();
    }).on('shopify:section:deselect', function() {
      soto.init();
    }).on('shopify:block:select', function() {
      soto.init();
    }).on('shopify:block:deselect', function() {
      soto.init();
    });
}


class MyScript{
  constructor(shopifyObj) {
    this.Shopify = shopifyObj;
    this.product = document.querySelector('body.product');
    this.pop_box = this.product.querySelector('.product_pop');
    this.product_pop = this.product.querySelector('.product-pop') ? this.product.querySelectorAll('.product-pop') : null;
    this.add_to_cart = this.product.querySelector('.add-to-cart_pop');
    this.variant = this.product.querySelector('.option__radio');

    !this.variant || this.variant.querySelectorAll('input').forEach(el => el.addEventListener('change', e => this.variantEneble(el)));
    !this.product_pop || this.product_pop.forEach(el => el.addEventListener('click', e => this.showPop(el, e)));
    !this.pop_box || this.pop_box.querySelector('.product_pop__close').addEventListener('click', e => {
      e.preventDefault();
      this.pop_box.classList.remove('active');
      this.product.classList.remove('product--pop');
    });
    !this.pop_box || this.pop_box.querySelector('.product_pop__select').addEventListener('click', e => this.selectProduct(e));
    !this.add_to_cart || this.add_to_cart.addEventListener('click', e => this.addToCart(e));
    

  }

  variantEneble(el){
    if (this.product.querySelector('#product-variants')){
      if (this.product.querySelector('.box__products__select').classList.contains('active')){
        this.product.querySelector('.box__products__select').querySelector('.remove').click();
      }
      let select = this.product.querySelector('#product-variants select');
      select.value = el.value
      let event = new Event('change');
      select.dispatchEvent(event);
      this.selectSlick(el.dataset.id);
    }

  }

  selectSlick(id){
    if (this.product.querySelector('.box__prodcutst__actual--variant')){
      this.product.querySelectorAll(`.box__prodcutst__actual--variant`).forEach(el => el.classList.remove('active'));
      this.product.querySelector(`.box__prodcutst__actual--variant[data-id="${id}"]`).classList.add('active');
    }
  }

  addToCart(e){
    e.preventDefault();
    let quantity = this.product.querySelector(".add-to-cart__quantity input[type='number']").value,
        id = this.product.querySelector("#product-select").value,
        id_2 = this.add_to_cart.dataset.id ? this.add_to_cart.dataset.id : false;

    this.add_to_cart.classList.add("is-loading");

    const requestData1 = {
      items: [
        {
          id: id,
          quantity: quantity,
        },
      ],
    };

    const requestData2 = {
      items: [
        {
          id: id_2,
          quantity: quantity,
        },
      ], 
    };

    this.sendAjaxRequest('/cart/add.js', 'POST', requestData1, (response1) => {

    }, function (error1) {
      console.error('Error while adding product 1 to the cart:', error1);
    });

    if(id_2){
      setTimeout(() => {
        this.sendAjaxRequest('/cart/add.js', 'POST', requestData2, (response2) => {
          this.add_to_cart.classList.remove("is-loading");
          soto.refreshCart();
        }, function (error1) {
          console.error('Error while adding product 2 to the cart:', error1);
        });
        
      }, 2000);
    }


    
  }

 sendAjaxRequest(url, method, data, successCallback, errorCallback) {
  const xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        try {
          const response = JSON.parse(xhr.responseText);
          successCallback(response);
        } catch (parseError) {
          errorCallback(parseError);
        }
      } else {
        errorCallback(xhr.status);
      }
    }
  };
  xhr.send(JSON.stringify(data));
}

  selectProduct(e){
    e.preventDefault();
    this.pop_box.classList.remove('active');
    this.product.classList.remove('product--pop');
    
    var selectedCheckboxes = this.pop_box.querySelectorAll('input:checked');
    var selectedIds = [];
    selectedCheckboxes.forEach(function(checkbox) {
      selectedIds.push(checkbox.value);
    });
    
    var selectedIdsString = selectedIds.join(',');
    this.product.querySelector('.add-to-cart_pop').dataset.id = selectedIdsString;
    
    if(this.product.querySelector('.js-add-bundle-to-cart')) {
      this.product.querySelector('.js-add-bundle-to-cart').dataset.upsellVariantIds = selectedIdsString;
    }
    
    if(selectedCheckboxes.length > 0) {
      this.productInfo(selectedCheckboxes[0]);
    }
     
  }

  productInfo(el){
    let item = el.nextElementSibling,
        image = item.querySelector('.item__box__image img'),
        title = item.querySelector('.title'),
        price = item.querySelector('.price'),
        box_select = this.product.querySelector('.box__products__select');
    box_select.dataset.id = el.value;
    box_select.classList.add('active');
    this.product.querySelector('.box__prodcust__pop').classList.add('hidden');
    box_select.querySelector('.image').innerHTML = image.outerHTML;
    box_select.querySelector('.info .top').innerHTML = `<h3>${title.innerHTML}</h3><h4>${price.innerHTML}</h4>`;
    this.renameAddCart();
    box_select.querySelector('.change').addEventListener('click', e => {
        e.preventDefault();
        this.showPop(box_select, e)
    })
    box_select.querySelector('.remove').addEventListener('click', e => {
      e.preventDefault();
      box_select.classList.remove('active');
      this.product.querySelector('.box__prodcust__pop').classList.remove('hidden');
      this.product.querySelector('.add-to-cart_pop').dataset.id = '';
      if(this.product.querySelector('.js-add-bundle-to-cart')) {
        this.product.querySelector('.js-add-bundle-to-cart').dataset.upsellVariantIds = '';
      }
      this.renameAddCart();
    });

  }

  renameAddCart(){
    let btn = this.product.querySelector('.add-to-cart_pop');
    
    if(btn.dataset.id && btn.dataset.id !== ''){
      var selectedIds = btn.dataset.id.split(',').filter(function(id) { return id.trim() !== ''; });
      var count = selectedIds.length;
      if(count > 0) {
        btn.innerText = 'Add plant & ' + count + ' upsell' + (count > 1 ? 's' : '') + ' to bag';
      } else {
        btn.innerText = 'Add plant to bag';
      }
    }else{
      btn.innerText = 'Add plant to bag';
    }
  }

  showPop(el, e){
    e.preventDefault();
    if(this.pop_box.classList.contains('product_pop--variants')){
      this.pop_box.classList.add('active');
      this.product.classList.add('product--pop');
      let item = el.closest('.owl-stage'),
          items = item.querySelector('.content') ? item.querySelectorAll('.content') : false,
          obc = [];
    
      if(items){
        items.forEach(itm => {
          obc.push({
            title: itm.querySelector('.upsell-item__product-title a').innerText,
            image: itm.querySelector('.product-pop img'),
            price: itm.querySelector('.upsell-item__price').innerText,
            id_variant: itm.querySelector('.product-pop').dataset.id,
            image_glob: itm.querySelector('.product-pop').dataset.image

          })
        })
        
        this.createElement(obc);
        
        var currentlySelected = this.product.querySelector('.add-to-cart_pop').dataset.id;
        if(currentlySelected) {
          var selectedIds = currentlySelected.split(',');
          selectedIds.forEach(function(id) {
            var checkbox = this.pop_box.querySelector(`input[value="${id.trim()}"]`);
            if(checkbox) {
              checkbox.checked = true;
            }
          }.bind(this));
        }
        
        let im = true;
        this.pop_box.querySelectorAll('.item input').forEach(it => {
          
            if(it.checked){
                im = false;
            }
        });
        if(im){
          let img = this.pop_box.querySelector('.left__image').dataset.src;
          this.pop_box.querySelector('.left__image img').src = img;
        }else{
          let firstChecked = this.pop_box.querySelector('input:checked');
          if(firstChecked) {
            let img = firstChecked.nextElementSibling.dataset.src;
            this.pop_box.querySelector('.left__image img').src = img;
          }
        }
        
        this.pop_box.querySelectorAll('.item input').forEach(it => it.addEventListener('click', e => {
            if(it.checked){
              let img = it.closest('label').querySelector('.item__box').dataset.src;
              this.pop_box.querySelector('.left__image').classList.add('left__image--fade');
              setTimeout(() => {
                this.pop_box.querySelector('.left__image img').src = img;
                this.pop_box.querySelector('.left__image').classList.remove('left__image--fade');
              }, 600);
            }
        }))
      }
      
    }else{
      this.pop_box.querySelector(`input[value="${el.dataset.id}"]`).checked = true;
      this.pop_box.classList.add('active');
      this.product.classList.add('product--pop');
      
    }
  }
  createElement(obc){
    let content = '';
    obc.forEach(el => {
      content += `<div class="item"><label>
      <input type="checkbox" class="js-upsell-checkbox" name="upsell_product[]" value="${el.id_variant}" data-variant-id="${el.id_variant}">
      <div class="item__box" data-src="${el.image_glob}">
      <div class="item__box__image">${el.image.outerHTML}</div>
      <h4 class="title">${el.title}</h4>
      <h5 class="price">${el.price}</h5>
      </div>
      </label></div>`
    })
    this.pop_box.querySelector('.product_pop__boxs').innerHTML = content;

  }
}

document.addEventListener("DOMContentLoaded", () => {
  new MyScript(Shopify);
});
