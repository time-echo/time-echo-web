export {
  StampPerforationFrame,
  type StampPerforationFrameProps,
  type StampSize,
} from "./StampPerforationFrame";

export {
  PostmarkOverlay,
  type PostmarkOverlayProps,
  type PostmarkVariant,
} from "./PostmarkOverlay";

export { Stamp, type StampProps } from "./Stamp";
export { LetterStamp, type LetterStampProps } from "./LetterStamp";

export {
  StampRenderer,
  type StampRendererProps,
  sanitizeSvg,
  SVG_PURIFY_CONFIG,
} from "./StampRenderer";

export {
  StampPickerModal,
  type StampPickerModalProps,
} from "./StampPickerModal";

export { useStampCatalog, type UseStampCatalogResult } from "./useStampCatalog";

export {
  STAMPS_CATALOG,
  STAMP_CATEGORIES,
  INITIAL_UNLOCKED_STAMP_IDS,
  DEFAULT_STAMP_ID,
  getStampById,
  getStampsByCategory,
  getLocalizedStamp,
  type StampCategory,
  type StampDefinition,
} from "./stamps.data";

export * from "./icons";
