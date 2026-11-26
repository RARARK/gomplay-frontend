import { Asset } from "expo-asset";
import { Image } from "expo-image";

// 로그인 직후 홈 화면에 바로 보이는 이미지들.
// 개발 모드(특히 --tunnel)에서는 로컬 이미지도 처음 표시될 때 Metro 서버에서 내려받기 때문에
// 홈 진입 순간 늦게 뜬다. 앱 시작(로그인 화면) 시점에 미리 받아 expo-image 캐시에 넣어 둔다.
const HOME_IMAGES = [
  require("@/assets/home/maintypo.png"),
  require("@/assets/home/herobannermain.webp"),
  require("@/assets/home/herobanner_dailycheck.jpg"),
  require("@/assets/home/Ellipse-8.png"),
  require("@/assets/home/ScheduleBear.png"),
  require("@/assets/home/MatchingBear.png"),
];

let started = false;

export function preloadHomeImages(): void {
  if (started) return;
  started = true;

  const uris = HOME_IMAGES.map((m) => Asset.fromModule(m).uri).filter(Boolean);
  Image.prefetch(uris).catch(() => {});
}
