import { ElLoading } from "element-plus";

let loadingGoal:ReturnType<typeof ElLoading.service>

const startLoading = () => {
  loadingGoal = ElLoading.service({
    fullscreen: true,
    lock: true,
    text: "Loading",
    background: "rgba(0, 0, 0, 0.7)",
  });
};

const endloading = () => {
  loadingGoal.close();
};

let needLoadingcount = 0;
export const showFullLoading = () => {
    if (needLoadingcount == 0) {
        startLoading();
    } 
    needLoadingcount++;
};
export const endFullLoading = () => {
    if (needLoadingcount <= 0) return;
    needLoadingcount--;
    if (needLoadingcount == 0) {
        endloading();
    }
};  