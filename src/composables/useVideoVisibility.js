import { onMounted, onBeforeUnmount, nextTick } from "vue";

export function useVideoVisibility(videoRef, targetRef, options = {}) {
  let observer;

  const {
    threshold = 0.5,
    root = null,
    rootMargin = "0px"
  } = options;

  const getEl = (ref) => {
    if (!ref?.value) return null;
    return ref.value.$el || ref.value; // <-- ключово
  };

  onMounted(async () => {
    await nextTick(); // гарантира, че DOM е готов

    const targetEl = getEl(targetRef);

    if (!targetEl) return;

    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const video = videoRef.value;

      if (!video) return;

      if (entry.isIntersecting) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }, { threshold, root, rootMargin });

    observer.observe(targetEl);
  });

  onBeforeUnmount(() => {
    const targetEl = getEl(targetRef);
    if (observer && targetEl) {
      observer.unobserve(targetEl);
    }
  });
}