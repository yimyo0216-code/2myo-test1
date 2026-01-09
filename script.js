const dots = document.querySelectorAll(".dot");
const hero = document.querySelector(".hero");
const heroTrack = document.querySelector(".hero__video-track");
const heroTitle = document.querySelector(".hero__title");
const scrollTopBtn = document.querySelector(".scroll-top");
const header = document.querySelector(".top");

// 히어로 슬라이드 정의 (3개) - 배경 스타일만 관리
const heroSlides = [
  {
    background:
      "radial-gradient(650px circle at 80% 30%, rgba(40,100,255,0.2), transparent 60%), radial-gradient(900px circle at 20% 20%, rgba(95,64,255,0.25), transparent 70%), #0b0f1e",
    titleHtml:
      'AI·클라우드 기반으로 설계부터 운영까지,<br>비즈니스 전 과정을 스마트하게<br>혁신하는 <span class="accent">AX 솔루션</span>',
  },
  {
    background:
      "radial-gradient(650px circle at 20% 25%, rgba(30,190,255,0.18), transparent 60%), radial-gradient(820px circle at 80% 25%, rgba(88,76,255,0.26), transparent 72%), #0a1024",
    titleHtml:
      '데이터와 자동화로 경영 효율을 높이고,<br>지속 가능한 성장을 실현하는<br>통합 <span class="accent">엔터프라이즈 솔루션</span>',
  },
  {
    background:
      "radial-gradient(700px circle at 60% 35%, rgba(62,108,223,0.28), transparent 60%), radial-gradient(600px circle at 30% 35%, rgba(28,132,255,0.22), transparent 65%), #0c1022",
    titleHtml:
      'AX와 AI 기술로 게임의 전 생애주기를<br>혁신하는 <span class="accent">게임 비즈니스 솔루션</span>',
  },
];

let currentSlide = 0;
let autoTimer = null;

const setSlide = (nextIndex) => {
  if (!hero) return;
  const total = heroSlides.length;
  currentSlide = (nextIndex + total) % total;

  const slide = heroSlides[currentSlide];
  hero.style.background = slide.background;
  if (heroTitle) {
    heroTitle.innerHTML = slide.titleHtml;
  }

  if (heroTrack) {
    heroTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
  }

  dots.forEach((dot, idx) => {
    dot.classList.toggle("is-active", idx === currentSlide);
  });

  // 자동 슬라이드 타이머 리셋
  if (autoTimer) clearTimeout(autoTimer);
  autoTimer = setTimeout(() => setSlide(currentSlide + 1), 5000);
};

dots.forEach((dot, idx) => {
  dot.addEventListener("click", () => setSlide(idx));
});

// 드래그로 슬라이드 전환
let dragStartX = null;
const dragThreshold = 50;

const getPointerX = (event) =>
  event.touches && event.touches.length ? event.touches[0].clientX : event.clientX;

const onDragStart = (event) => {
  dragStartX = getPointerX(event);
  if (autoTimer) clearTimeout(autoTimer);
};

const onDragEnd = (event) => {
  if (dragStartX === null) return;
  const endX = getPointerX(event);
  const deltaX = endX - dragStartX;
  if (Math.abs(deltaX) > dragThreshold) {
    setSlide(currentSlide + (deltaX < 0 ? 1 : -1));
  }
  dragStartX = null;
};

hero?.addEventListener("pointerdown", onDragStart);
hero?.addEventListener("pointerup", onDragEnd);
hero?.addEventListener("pointercancel", () => (dragStartX = null));
hero?.addEventListener("touchstart", onDragStart, { passive: true });
hero?.addEventListener("touchend", onDragEnd);

// 맨위로 이동
scrollTopBtn?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// 헤더 스크롤 배경 전환
const toggleHeaderOnScroll = () => {
  if (!header) return;
  const shouldBeSolid = window.scrollY > 10;
  header.classList.toggle("scrolled", shouldBeSolid);
};

window.addEventListener("scroll", toggleHeaderOnScroll);
toggleHeaderOnScroll();

// 초기 슬라이드 적용
setSlide(0);

// 서비스 슬라이더
const servicesGrid = document.querySelector(".services-grid");
const servicesSlider = document.querySelector(".services-slider");
const prevArrow = document.querySelector(".arrow--prev");
const nextArrow = document.querySelector(".arrow--next");

if (servicesGrid && servicesSlider) {
  let currentScroll = 0;
  const cardWidth = 830; // 카드 너비 (flex-basis)
  const gap = 102; // gap 값
  const cardTotalWidth = cardWidth + gap;
  const totalCards = servicesGrid.children.length;
  const maxScroll = (totalCards - 1) * cardTotalWidth;

  const updateScrollButtons = () => {
    if (prevArrow) {
      if (currentScroll === 0) {
        prevArrow.classList.add("disabled");
      } else {
        prevArrow.classList.remove("disabled");
      }
    }
    if (nextArrow) {
      if (currentScroll >= maxScroll) {
        nextArrow.classList.add("disabled");
      } else {
        nextArrow.classList.remove("disabled");
      }
    }
  };

  const scrollServices = (direction) => {
    if (direction === "prev") {
      currentScroll = Math.max(0, currentScroll - cardTotalWidth);
    } else {
      currentScroll = Math.min(maxScroll, currentScroll + cardTotalWidth);
    }
    servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
    updateScrollButtons();
  };

  // 화살표 버튼 이벤트
  prevArrow?.addEventListener("click", () => {
    if (currentScroll > 0) scrollServices("prev");
  });

  nextArrow?.addEventListener("click", () => {
    if (currentScroll < maxScroll) scrollServices("next");
  });

  // 키보드 방향키 이벤트
  const handleKeyDown = (event) => {
    // services 섹션이 뷰포트에 있을 때만 작동
    const servicesSection = document.getElementById("services");
    if (!servicesSection) return;
    
    const rect = servicesSection.getBoundingClientRect();
    const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
    
    if (!isInViewport) return;
    
    if (event.key === "ArrowLeft" && currentScroll > 0) {
      event.preventDefault();
      scrollServices("prev");
    } else if (event.key === "ArrowRight" && currentScroll < maxScroll) {
      event.preventDefault();
      scrollServices("next");
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  // 초기 화살표 상태 설정
  updateScrollButtons();

  // 탭 필터 기능
  const pillButtons = document.querySelectorAll(".pill-row .pill");
  const categoryMap = {
    "AX 솔루션": 0,
    "엔터프라이즈 솔루션": 2,
    "게임 비즈니스 솔루션": 5,
    "IT 인프라 서비스": 6
  };

  const scrollToCategory = (categoryName) => {
    const targetIndex = categoryMap[categoryName];
    if (targetIndex !== undefined) {
      currentScroll = targetIndex * cardTotalWidth;
      servicesGrid.style.transition = "transform 0.4s ease";
      servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
      updateScrollButtons();
    }
  };

  pillButtons.forEach((pill) => {
    pill.addEventListener("click", () => {
      // 모든 pill에서 is-active 제거
      pillButtons.forEach((p) => p.classList.remove("is-active"));
      // 클릭한 pill에 is-active 추가
      pill.classList.add("is-active");
      // 해당 카테고리의 첫 번째 아이템으로 스크롤
      const categoryName = pill.textContent.trim();
      scrollToCategory(categoryName);
    });
  });

  // 마우스 드래그 스크롤 기능
  let isDragging = false;
  let startX = 0;
  let dragStartScroll = 0;

  const snapToCard = () => {
    const cardIndex = Math.round(currentScroll / cardTotalWidth);
    currentScroll = Math.max(0, Math.min(maxScroll, cardIndex * cardTotalWidth));
    servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
    updateScrollButtons();
  };

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.pageX - servicesSlider.offsetLeft;
    dragStartScroll = currentScroll;
    servicesSlider.style.cursor = "grabbing";
    servicesGrid.style.transition = "none"; // 드래그 중에는 전환 효과 제거
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - servicesSlider.offsetLeft;
    const walk = (startX - x) * 1.5; // 드래그 속도 조절
    const newScroll = dragStartScroll + walk;
    
    // 경계 체크
    if (newScroll < 0) {
      currentScroll = 0;
    } else if (newScroll > maxScroll) {
      currentScroll = maxScroll;
    } else {
      currentScroll = newScroll;
    }
    
    servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    servicesSlider.style.cursor = "grab";
    servicesGrid.style.transition = "transform 0.4s ease"; // 전환 효과 복원
    snapToCard(); // 가장 가까운 카드로 스냅
  };

  const onMouseLeave = () => {
    if (isDragging) {
      isDragging = false;
      servicesSlider.style.cursor = "grab";
      servicesGrid.style.transition = "transform 0.4s ease";
      snapToCard();
    }
  };

  // 터치 이벤트 (모바일 지원)
  let touchStartX = 0;
  let touchStartScroll = 0;

  const onTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartScroll = currentScroll;
    servicesGrid.style.transition = "none";
  };

  const onTouchMove = (e) => {
    if (!touchStartX) return;
    const touchX = e.touches[0].clientX;
    const walk = (touchStartX - touchX) * 1.5;
    const newScroll = touchStartScroll + walk;
    
    if (newScroll < 0) {
      currentScroll = 0;
    } else if (newScroll > maxScroll) {
      currentScroll = maxScroll;
    } else {
      currentScroll = newScroll;
    }
    
    servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
  };

  const onTouchEnd = () => {
    if (!touchStartX) return;
    touchStartX = 0;
    servicesGrid.style.transition = "transform 0.4s ease";
    snapToCard();
  };

  // 이벤트 리스너 등록
  servicesSlider.style.cursor = "grab";
  servicesSlider.addEventListener("mousedown", onMouseDown);
  servicesSlider.addEventListener("mousemove", onMouseMove);
  servicesSlider.addEventListener("mouseup", onMouseUp);
  servicesSlider.addEventListener("mouseleave", onMouseLeave);
  servicesSlider.addEventListener("touchstart", onTouchStart, { passive: true });
  servicesSlider.addEventListener("touchmove", onTouchMove, { passive: false });
  servicesSlider.addEventListener("touchend", onTouchEnd);
}

