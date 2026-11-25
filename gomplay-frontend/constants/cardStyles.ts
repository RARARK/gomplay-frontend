import type { ViewStyle } from "react-native";

/**
 * 목록 카드의 공통 그림자 프레임 (탐색 탭 모집 카드 기준).
 * 테두리가 있는 카드 본체를 이 프레임으로 감싸 그림자 값을 한 곳에서 관리한다.
 *
 * 참고: 탐색 탭처럼 보이려면 목록 영역의 폭이 카드 폭과 같아
 * 좌우 그림자가 목록 경계에서 잘려야 한다 (아래쪽 그림자만 보임).
 */
export const cardShadowFrame: ViewStyle = {
  borderRadius: 18,
  backgroundColor: "#FFFFFF",
  shadowColor: "#000000",
  shadowOffset: { width: 0, height: 3 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 3,
};
