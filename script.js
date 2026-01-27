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
    titleHtmlMobile:
      'AI·클라우드 기반으로<br>설계부터 운영까지, 비즈니스<br>전 과정을 스마트하게<br>혁신하는 <span class="accent">AX 솔루션</span>',
  },
  {
    background:
      "radial-gradient(650px circle at 20% 25%, rgba(30,190,255,0.18), transparent 60%), radial-gradient(820px circle at 80% 25%, rgba(88,76,255,0.26), transparent 72%), #0a1024",
    titleHtml:
      '데이터와 자동화로 경영 효율을 높이고,<br>지속 가능한 성장을 실현하는<br>통합 <span class="accent">엔터프라이즈 솔루션</span>',
    titleHtmlMobile:
      '데이터와 자동화로<br>경영 효율을 높이고<br>지속 가능한 성장을 실현하는<br>통합 <span class="accent">엔터프라이즈 솔루션</span>',
  },
  {
    background:
      "radial-gradient(700px circle at 60% 35%, rgba(62,108,223,0.28), transparent 60%), radial-gradient(600px circle at 30% 35%, rgba(28,132,255,0.22), transparent 65%), #0c1022",
    titleHtml:
      'AX와 AI 기술로 게임의 전 생애주기를<br>혁신하는 <span class="accent">게임 비즈니스 솔루션</span>',
    titleHtmlMobile:
      'AX와 AI 기술로 게임의<br>전 생애주기를 혁신하는<br><span class="accent">게임 비즈니스 솔루션</span>',
  },
];

let currentSlide = 0;
let autoTimer = null;

const isMobileHero = () => typeof window !== "undefined" && window.innerWidth <= 959;

const setSlide = (nextIndex) => {
  if (!hero) return;
  const total = heroSlides.length;
  currentSlide = (nextIndex + total) % total;

  const slide = heroSlides[currentSlide];
  hero.style.background = slide.background;
  if (heroTitle) {
    const html = isMobileHero() && slide.titleHtmlMobile ? slide.titleHtmlMobile : slide.titleHtml;
    heroTitle.innerHTML = html;
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

// 959px 전환 시 타이틀 재적용
window.addEventListener("resize", () => {
  setSlide(currentSlide);
});

// 서브메뉴를 메인 메뉴 항목에 맞춰 정렬
const topLinkGroup = document.querySelector(".top-link-group");
const submenuPanel = document.querySelector(".submenu-panel");

const alignSubmenuToMenu = () => {
  if (!topLinkGroup || !submenuPanel) return;
  
  const headerRect = header.getBoundingClientRect();
  const menuItems = topLinkGroup.querySelectorAll(".top-link-item");
  const submenuSections = submenuPanel.querySelectorAll(".submenu-section");
  
  // 각 메뉴 항목과 서브메뉴 섹션을 매칭하여 정렬
  menuItems.forEach((menuItem, index) => {
    if (index < submenuSections.length) {
      const menuItemRect = menuItem.getBoundingClientRect();
      const relativeLeft = menuItemRect.left - headerRect.left;
      
      // 서브메뉴 섹션을 해당 메뉴 항목에 맞춰 정렬
      // 패널이 top: 0px부터 시작하고, 헤더(85px) + 여백(58px) - 50px = 93px 위치에 배치
      submenuSections[index].style.position = "absolute";
      submenuSections[index].style.left = `${relativeLeft}px`;
      submenuSections[index].style.top = "93px";
    }
  });
  
  // 패널의 패딩을 제거 (섹션들이 absolute로 배치되므로)
  submenuPanel.style.paddingLeft = "0";
};

// 마우스 오버 시 정렬
if (topLinkGroup && submenuPanel) {
  topLinkGroup.addEventListener("mouseenter", () => {
    // 패널이 이미 열려있으면 아무것도 하지 않음
    if (!submenuPanel.classList.contains("open")) {
      alignSubmenuToMenu();
      submenuPanel.classList.add("open");
    }
    document.body.classList.add("submenu-open");
  });
  topLinkGroup.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!submenuPanel.matches(':hover') && 
          !newsLink?.matches(':hover') &&
          !careersLink?.matches(':hover')) {
        submenuPanel.classList.remove("open");
        document.body.classList.remove("submenu-open");
      }
    }, 100);
  });
  submenuPanel.addEventListener("mouseenter", alignSubmenuToMenu);
  
  // 윈도우 리사이즈 시에도 정렬
  window.addEventListener("resize", alignSubmenuToMenu);
  
  // 초기 정렬
  alignSubmenuToMenu();
}

// "소식"과 "채용" 메뉴에도 회사소개/기술과 서비스와 동일한 패널이 열리도록
const newsLink = document.querySelector('.top-links a[href="#news"]');
const careersLink = document.querySelector('.top-links a[href="#careers"]');

if (submenuPanel && (newsLink || careersLink)) {
  // 모든 메뉴 항목에서 같은 패널을 열기 위한 함수
  const openSamePanel = () => {
    // 패널이 이미 열려있으면 아무것도 하지 않음
    if (submenuPanel.classList.contains("open")) {
      return;
    }
    // 기존 정렬 함수를 호출하여 회사소개/기술과 서비스 서브메뉴가 정렬되도록 함
    alignSubmenuToMenu();
    // 같은 패널을 열기 위해 open 클래스 추가
    submenuPanel.classList.add("open");
    // 패널이 열릴 때 소식/채용 메뉴 색상 변경을 위해 body에 클래스 추가
    document.body.classList.add("submenu-open");
  };
  
  const closePanel = () => {
    // 패널이나 4개 메뉴 항목 중 하나에 마우스가 있으면 닫지 않음
    setTimeout(() => {
      if (!submenuPanel.matches(':hover') && 
          !topLinkGroup?.matches(':hover') &&
          !newsLink?.matches(':hover') &&
          !careersLink?.matches(':hover')) {
        submenuPanel.classList.remove("open");
        document.body.classList.remove("submenu-open");
      }
    }, 100);
  };

  // 소식 메뉴에 이벤트 추가
  if (newsLink) {
    newsLink.addEventListener("mouseenter", openSamePanel);
    newsLink.addEventListener("mouseleave", closePanel);
  }

  // 채용 메뉴에 이벤트 추가
  if (careersLink) {
    careersLink.addEventListener("mouseenter", openSamePanel);
    careersLink.addEventListener("mouseleave", closePanel);
  }
  
  // 패널에서 마우스가 벗어날 때 (4개 메뉴 모두 확인)
  submenuPanel.addEventListener("mouseleave", () => {
    setTimeout(() => {
      if (!topLinkGroup?.matches(':hover') &&
          !newsLink?.matches(':hover') &&
          !careersLink?.matches(':hover')) {
        submenuPanel.classList.remove("open");
        document.body.classList.remove("submenu-open");
      }
    }, 100);
  });
}

// 서비스 슬라이더
const servicesGrid = document.querySelector(".services-grid");
const servicesSlider = document.querySelector(".services-slider");
const prevArrow = document.querySelector(".arrow--prev");
const nextArrow = document.querySelector(".arrow--next");

// 이미지 드래그 방지
const serviceImages = document.querySelectorAll(".service-item__media");
serviceImages.forEach((img) => {
  img.setAttribute("draggable", "false");
  img.addEventListener("dragstart", (e) => {
    e.preventDefault();
    return false;
  });
});

if (servicesGrid && servicesSlider) {
  const isMobile = () => window.innerWidth <= 959;
  const servicesMoreBtn = document.querySelector(".services-more-btn");
  const serviceItems = Array.from(servicesGrid.querySelectorAll(".service-item"));
  
  // 모바일 필터링 및 더 보기 기능
  const filterAndShowItems = (category) => {
    let visibleItems = [];
    
    serviceItems.forEach((item, index) => {
      const itemCategory = item.getAttribute("data-category");
      const shouldShow = category === "all" || itemCategory === category;
      
      if (shouldShow) {
        item.classList.remove("hidden");
        visibleItems.push(item);
      } else {
        item.classList.add("hidden");
      }
    });
    
    // 기본 4개만 보이고 나머지는 숨김
    visibleItems.forEach((item, index) => {
      if (index >= 4) {
        item.classList.add("hidden");
        item.classList.add("more-item");
      } else {
        item.classList.remove("hidden");
        item.classList.remove("more-item");
      }
    });
    
    // 더 보기 버튼 표시/숨김
    if (servicesMoreBtn) {
      if (visibleItems.length > 4) {
        servicesMoreBtn.classList.remove("hidden");
        servicesMoreBtn.style.display = "block";
      } else {
        servicesMoreBtn.classList.add("hidden");
        servicesMoreBtn.style.display = "none";
      }
    }
  };
  
  // 더 보기 버튼 클릭
  if (servicesMoreBtn) {
    servicesMoreBtn.addEventListener("click", () => {
      const hiddenItems = servicesGrid.querySelectorAll(".service-item.more-item");
      hiddenItems.forEach(item => {
        item.classList.remove("hidden");
        item.classList.remove("more-item");
      });
      servicesMoreBtn.classList.add("hidden");
      servicesMoreBtn.style.display = "none";
    });
  }
  
  // 탭 필터 기능 (모바일)
  const pillButtons = document.querySelectorAll(".pill-row .pill");
  
  pillButtons.forEach((pill) => {
    pill.addEventListener("click", () => {
      const category = pill.getAttribute("data-category") || "all";
      
      // 모든 pill에서 is-active 제거
      pillButtons.forEach((p) => p.classList.remove("is-active"));
      // 클릭한 pill에 is-active 추가
      pill.classList.add("is-active");
      
      if (isMobile()) {
        // 모바일: 필터링 및 재나열
        filterAndShowItems(category);
      } else {
        // PC: 기존 스크롤 방식
        const categoryMap = {
          "all": 0,
          "AX 솔루션": 0,
          "엔터프라이즈 솔루션": 2,
          "게임 비즈니스 솔루션": 5,
          "IT 인프라 서비스": 6
        };
        const targetIndex = categoryMap[category];
        if (targetIndex !== undefined) {
          let currentScroll = 0;
          const cardWidth = 830;
          const gap = 102;
          const cardTotalWidth = cardWidth + gap;
          currentScroll = targetIndex * cardTotalWidth;
          servicesGrid.style.transition = "transform 0.4s ease";
          servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
        }
      }
    });
  });
  
  // 초기 상태 설정 (모바일)
  if (isMobile()) {
    filterAndShowItems("all");
  }
  
  // 리사이즈 시 모바일/PC 전환
  window.addEventListener("resize", () => {
    if (isMobile()) {
      const activePill = document.querySelector(".pill.is-active");
      const category = activePill ? (activePill.getAttribute("data-category") || "all") : "all";
      filterAndShowItems(category);
    } else {
      // PC: 모든 아이템 표시
      serviceItems.forEach(item => {
        item.classList.remove("hidden");
        item.classList.remove("more-item");
      });
      if (servicesMoreBtn) {
        servicesMoreBtn.classList.add("hidden");
        servicesMoreBtn.style.display = "none";
      }
    }
  });

  // PC 전용 코드
  let currentScroll = 0;
  const cardWidth = 830; // 카드 너비 (flex-basis)
  const gap = 102; // gap 값
  const cardTotalWidth = cardWidth + gap;
  const totalCards = servicesGrid.children.length;
  const maxScroll = (totalCards - 1) * cardTotalWidth;

  const updateScrollButtons = () => {
    if (!isMobile() && prevArrow) {
      if (currentScroll === 0) {
        prevArrow.classList.add("disabled");
      } else {
        prevArrow.classList.remove("disabled");
      }
    }
    if (!isMobile() && nextArrow) {
      if (currentScroll >= maxScroll) {
        nextArrow.classList.add("disabled");
      } else {
        nextArrow.classList.remove("disabled");
      }
    }
  };

  const scrollServices = (direction) => {
    if (isMobile()) return;
    if (direction === "prev") {
      currentScroll = Math.max(0, currentScroll - cardTotalWidth);
    } else {
      currentScroll = Math.min(maxScroll, currentScroll + cardTotalWidth);
    }
    servicesGrid.style.transform = `translateX(-${currentScroll}px)`;
    updateScrollButtons();
  };

  // 화살표 버튼 이벤트 (PC만)
  if (!isMobile()) {
    prevArrow?.addEventListener("click", () => {
      if (currentScroll > 0) scrollServices("prev");
    });

    nextArrow?.addEventListener("click", () => {
      if (currentScroll < maxScroll) scrollServices("next");
    });

    // 키보드 방향키 이벤트
    const handleKeyDown = (event) => {
      if (isMobile()) return;
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
    updateScrollButtons();
  }

  // 마우스 드래그 스크롤 기능 (PC만)
  if (!isMobile()) {
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
      servicesGrid.style.transition = "none";
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - servicesSlider.offsetLeft;
      const walk = (startX - x) * 1.5;
      const newScroll = dragStartScroll + walk;
      
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
      servicesGrid.style.transition = "transform 0.4s ease";
      snapToCard();
    };

    const onMouseLeave = () => {
      if (isDragging) {
        isDragging = false;
        servicesSlider.style.cursor = "grab";
        servicesGrid.style.transition = "transform 0.4s ease";
        snapToCard();
      }
    };

    // 터치 이벤트 (PC에서도 지원)
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

    // 이벤트 리스너 등록 (PC만)
    servicesSlider.style.cursor = "grab";
    servicesSlider.addEventListener("mousedown", onMouseDown);
    servicesSlider.addEventListener("mousemove", onMouseMove);
    servicesSlider.addEventListener("mouseup", onMouseUp);
    servicesSlider.addEventListener("mouseleave", onMouseLeave);
    servicesSlider.addEventListener("touchstart", onTouchStart, { passive: true });
    servicesSlider.addEventListener("touchmove", onTouchMove, { passive: false });
    servicesSlider.addEventListener("touchend", onTouchEnd);
  }
}

// 모바일 햄버거 메뉴 토글
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
const mobileMenuClose = document.querySelector(".mobile-menu-close");

if (mobileMenuToggle && mobileMenuOverlay) {
  mobileMenuToggle.addEventListener("click", () => {
    mobileMenuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });
}

if (mobileMenuClose && mobileMenuOverlay) {
  mobileMenuClose.addEventListener("click", () => {
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });
}

// 모바일 메뉴 링크 클릭 시 메뉴 닫기
const mobileMenuLinks = document.querySelectorAll(".mobile-menu-link");
mobileMenuLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (mobileMenuOverlay) {
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});