// 设置滑到一定位置出现固定导航栏
const headerEl = document.querySelector("header");
const scrollToTop = document.querySelector(".scrollToTop"); //获取了class为scrollToTop button标签
window.addEventListener("scroll", () => {
  let height = headerEl.getBoundingClientRect().height; //获取导航栏的高度
  if (window.pageYOffset - height > 800) {
    //如果下拉的窗口高度减去导航栏高度，即下拉到一定位置
    if (!headerEl.classList.contains("sticky")) {
      //而且目前的标题标签header 中class不包括sticky
      headerEl.classList.add("sticky"); //则给header标签加上class = sticky
    }
  } else {
    headerEl.classList.remove("sticky"); //否则删除sticky
  }

  if (window.pageYOffset > 2000) {
    //如果下拉到一定位置
    scrollToTop.style.display = "block"; //把回到顶部按钮显示为block
  } else {
    scrollToTop.style.display = "none"; //否则显示none
  }
});
const glide = new Glide(".glide"); //定义轮播组件
const captionsEl = document.querySelectorAll(".slide-caption"); //querySelectorAll可以选中css样式中的s所有指定元素
//要让文字在轮播和翻页后显现，需要设定监听事件,glide提供轮播后和翻页后的事件，是mount和run,都在手册中可以翻阅
glide.on(["mount.after", "run.after"], () => {
  // 现获取当前轮播页面的样式，glide.index表示当前轮播图片的下标
  const caption = captionsEl[glide.index];
  // 然后给文字设置一个动画效果
  anime({
    targets: caption.children, //设置对象，即h1,h3和按钮
    opacity: [0, 1], //透明度从无到有
    duration: 400, //动画执行时间400毫秒
    easing: "linear", //执行函数是线性的
    delay: anime.stagger(400, { start: 300 }), //延迟，即每个动画延迟400毫秒，开始动画前停顿300毫秒
    translateY: [anime.stagger([40, 10]), 0], //从下往上滑的效果，最后来到原来的位置，这里的stagger表示h1是从40开始滑，h3是从40到10之间，按钮是10
  });
});

// 在轮播之前，得把透明度还原成0，这样每次轮播都会有动画

glide.on("run.before", () => {
  document.querySelectorAll(".slide-caption > *").forEach((el) => {
    el.style.opacity = 0; //全选所有slide-caption的css元素并遍历，把每一个元素透明度改变
  });
});

glide.mount();

//选手风采的筛选器,先选定放图片的打容器，然后排列模式选择行模式排列，就是满一行换一行
const isotope = new Isotope(".cases", {
  layoutMode: "fitRows",
  itemSelector: ".case-item",
});

// 获取筛选按钮的实例

const filterBtns = document.querySelector(".filter-btns");

filterBtns.addEventListener("click", (e) => {
  let { target } = e;
  const filterOption = target.getAttribute("data-filter"); //设置筛选器属性，绑定data-filter
  if (filterOption) {
    document
      .querySelectorAll(".filter-btn.active")
      .forEach((btn) => btn.classList.remove("active")); //先遍历所有筛选器，把active去除
    target.classList.add("active"); //然后把active添加到选定的target上

    isotope.arrange({ filter: filterOption }); //isotope的固定格式
  }
});

// 使用scrol库

const staggerinOption = {
  delay: 300,
  distance: "50px",
  duration: 500, //动画执行500毫秒
  easing: "ease-in-out",
  origin: "bottom", //从下往上出现
};
ScrollReveal().reveal(".feature", { ...staggerinOption, interval: 350 }); //绑定关于我们中的feature,然后用staggerinOption中的设定，再加上interval（表示过350毫秒轮流播放）

//游戏训练也一样

ScrollReveal().reveal(".service-item", { ...staggerinOption, interval: 350 });

const dataSectionEl = document.querySelector(".data-section");
//设置数字从0开始显现效果

ScrollReveal().reveal(".data-section", {
  beforeReveal: () => {
    //设定在显示完成之前
    anime({
      targets: ".data-piece .num", //绑定数字
      innerHTML: (el) => {
        return [0, el.innerHTML]; //因为是钉死在html中的数字,返回从0开始变化到指定数字
      },
      duration: 2000, //动画执行2000秒
      round: 1, //变化的单位是1
      easing: "easeInExpo", //样式选择
    });

    //给数字的背景增加一个移动视差效果
    dataSectionEl.style.backgroundPosition = `center calc(50% - ${
      dataSectionEl.getBoundingClientRect().bottom / 5
    }px)`; //把样式的背景位置设置成当前元素大小/5
  },
});

window.addEventListener("scroll", () => {
  const bottom = dataSectionEl.getBoundingClientRect().bottom;
  const top = dataSectionEl.getBoundingClientRect().top;

  if (bottom >= 0 && top <= window.innerHeight) {
    //当数字板块出现在窗口中才开始刷新背景位置，优化，windows.innerHeight是窗口最底部
    dataSectionEl.style.backgroundPosition = `center calc(50% - ${
      bottom / 5
    }px)`;
  }
});

// 初始化流畅滑动对象

const scroll = new SmoothScroll(`nav a[href*="#"], .scrollToTop a[href*="#"]`, {
  //选中所有nav a的标签和返回最顶层的按钮
  header: "header", //添加固定的导航
  offset: 80, //多移动80
});

document.addEventListener("scrollStart", () => {
  //这是scroll的一个事件，加上监听，开始滑动到固定位置时
  if (headerEl.classList.contains("open")) {
    headerEl.classList.remove("open");
  }
});

//让两页轮播图中的探索更多按钮都可以跳转到关于我们界面，两页轮播图所以是数组，所以要用到循环

const exploreBtnEls = document.querySelectorAll(".explore-btn"); //选定两张轮播图中的按钮，要用selectall
exploreBtnEls.forEach((exploreBtnEl) => {
  exploreBtnEl.addEventListener("click", () => {
    scroll.animateScroll(document.querySelector("#about-us")); //直接用id绑定关于我们，用#ID
  });
});

// 响应式布局

//折叠按钮
const burgerEl = document.querySelector(".burger");
burgerEl.addEventListener("click", () => {
  headerEl.classList.toggle("open"); //这句话就是点击了三条斜杠之后，header标签加上class = open，toggle意思是再点击一下class = open又移除了
});
