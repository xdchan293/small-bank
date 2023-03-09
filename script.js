'use strict';

///////////////////////////////////////
// Modal window
const $ = ele => document.querySelector(ele);
const modal = $('.modal');
const overlay = $('.overlay');
const btnCloseModal = $('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = $('.btn--scroll-to');
const section1 = $('#section--1');
const nav = $('.nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = $('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

//修改导航栏的透明度
const handleHover = function(e) {
    if (e.target.classList.contains('nav__link')) {
        //寻找父节点
        const parent = e.target.closest('.nav');
        const linkArr = parent.querySelectorAll('.nav__link');
        const logo = parent.querySelector('.nav__logo');

        linkArr.forEach(link => {
            if (link !== e.target) {
                link.style.opacity = this;
            }
        })
        logo.style.opacity = this;
    }
}

const openModal = function(e) {
    e.preventDefault();
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
};

const closeModal = function() {
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

//慢跳转
btnScrollTo.addEventListener('click', function(e) {
    // const scroll1 = section1.getBoundingClientRect();
    // Scrolling
    // window.scrollTo(
    //   s1coords.left + window.pageXOffset,
    //   s1coords.top + window.pageYOffset
    // );

    // window.scrollTo({
    //   left: s1coords.left + window.pageXOffset,
    //   top: s1coords.top + window.pageYOffset,
    //   behavior: 'smooth',
    // });

    section1.scrollIntoView({ behavior: 'smooth' });
})

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
        closeModal();
    }
});

//导航点击事件,慢跳转
$('.nav__links').addEventListener('click', function(e) {

    e.preventDefault();

    if (e.target.classList.contains('nav__link')) {

        const id = e.target.getAttribute('href');
        console.log(id)
        $(id).scrollIntoView({
            behavior: 'smooth'
        })
    }
})



nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));


///////////////////////////////////////
// Tabbed component
tabsContainer.addEventListener('click', function(e) {
    // console.log()
    //获取被点击的按钮
    const clicked = e.target.closest('.operations__tab');

    if (!clicked) return;



    tabs.forEach(ele => {
        ele.classList.remove('operations__tab--active');
    })
    tabsContent.forEach(ele => {
            ele.classList.remove('operations__content--active');
        })
        //为选定的元素添加样式

    clicked.classList.add('operations__tab--active');

    $(`.operations__content--${clicked.dataset.tab}`)
        .classList.add('operations__content--active');
})


//粘性导航栏的实现
const header = $('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
    const [entry] = entries;

    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
}

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`
})

headerObserver.observe(header);
//粘性导航

///////////////////////////////////////
// Reveal sections
const sectionArr = document.querySelectorAll('.section');

const revealSection = function(entries, observer) {
    const [entry] = entries;

    if (!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
})

//先绑定观察事件和隐藏
sectionArr.forEach(ele => {
    sectionObserver.observe(ele);
    ele.classList.add('section--hidden');
})

//懒加载
const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer) {
    const [entry] = entries;
    console.log(entry.target)

    if (!entry.isIntersecting) return;

    entry.target.src = entry.target.dataset.src;
    //图片完全加载出来之后再移除遮蔽效果
    entry.target.addEventListener('load', function(e) {
        entry.target.classList.remove('lazy-img')
    })

    observer.unobserve(entry.target);
}

const imgObserver = new IntersectionObserver(loadImg, {
    root: null,
    threshold: 0,
    rootMargin: `200px`
})

imgTargets.forEach(ele => imgObserver.observe(ele));


//走马灯
const slider = function() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide = 0;
    const maxSlide = slides.length;

    const creatDot = function() {
        slides.forEach(function(_, i) {
            dotContainer.insertAdjacentHTML('beforeend',
                `<button class="dots__dot" data-slide="${i}"></button>`);
        });
    }

    const activeDot = function(slide) {
        document.querySelectorAll('.dots__dot')
            .forEach(dot => dot.classList.remove('dots__dot--active'))

        $(`.dots__dot[data-slide="${slide}"]`)
            .classList.add('dots__dot--active')
    }

    const goToSlide = function(slide) {
        slides.forEach(
            (s, index) => {
                s.style.transform = `translateX(${100 * (index - slide)}%)`
            }
        )
    }

    const nextSlide = function() {
        curSlide = (curSlide + 1) % maxSlide;
        goToSlide(curSlide);
        activeDot(curSlide);
    }

    const prevSlide = function() {
        if (curSlide === 0) {
            curSlide = maxSlide - 1;
        } else {
            curSlide--;
        }
        goToSlide(curSlide);
        activeDot(curSlide);
    }

    const init = function() {
        goToSlide(0);

        creatDot();

        activeDot(0);
    }

    init();

    // Event handlers
    btnRight.addEventListener('click', nextSlide);
    btnLeft.addEventListener('click', prevSlide);

    document.addEventListener('keydown', function(e) {
        e.key === 'ArrowLeft' && prevSlide();
        e.key === 'ArrowRight' && nextSlide();
    })

    dotContainer.addEventListener('click', function(e) {
        console.log(e.target)
        if (!e.target.classList.contains('dots__dot')) return;
        const { slide } = e.target.dataset;

        curSlide = slide;
        goToSlide(curSlide);

        activeDot(curSlide);
    })
}

slider();