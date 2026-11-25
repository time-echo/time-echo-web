import type { SupportedLanguage } from "@/types/timeecho";

export interface UtmParameters {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface Ga4PageViewProperties extends UtmParameters {
  page_path: string;
  page_location?: string;
  page_title?: string;
  language?: SupportedLanguage | string;
}

export interface Ga4AuthEventProperties extends UtmParameters {
  method: "magic_link" | "password" | "google" | "facebook";
  language?: SupportedLanguage | string;
}

export interface Ga4GenerateLeadProperties extends UtmParameters {
  lead_source: "landing_composer" | "magic_link_request";
  language?: SupportedLanguage | string;
}

export interface Ga4ShareProperties {
  method: "clipboard" | "native_share" | "link" | string;
  content_type: "letter";
  item_id?: string;
  language?: SupportedLanguage | string;
}

export type LetterFunnelSource = "landing" | "composer";

export type LetterFunnelHorizonPreset = "6m" | "1y" | "3y" | "5y" | "custom";

export interface LetterFunnelBaseProperties extends UtmParameters {
  source: LetterFunnelSource;
  locale: SupportedLanguage;
  is_authenticated: boolean;
}

export type StartLetterProperties = LetterFunnelBaseProperties;

export interface SelectDateProperties extends LetterFunnelBaseProperties {
  horizon_preset: LetterFunnelHorizonPreset;
  horizon_days: number;
}

export interface FillPredictionsProperties extends LetterFunnelBaseProperties {
  predictions_count: number;
}

export interface LetterSubmissionProperties extends LetterFunnelBaseProperties {
  horizon_days: number;
  predictions_count: number;
  has_stamp: boolean;
}

export type SubmitLetterProperties = LetterSubmissionProperties;
export type LetterSuccessProperties = LetterSubmissionProperties;

export interface LetterFunnelEventMap {
  start_letter: StartLetterProperties;
  select_date: SelectDateProperties;
  fill_predictions: FillPredictionsProperties;
  submit_letter: SubmitLetterProperties;
  letter_success: LetterSuccessProperties;
}

export interface Ga4EventMap extends LetterFunnelEventMap {
  page_view: Ga4PageViewProperties;
  sign_up: Ga4AuthEventProperties;
  login: Ga4AuthEventProperties;
  generate_lead: Ga4GenerateLeadProperties;
  share: Ga4ShareProperties;
}

export type Ga4EventName = keyof Ga4EventMap;

export interface PostHogLetterCreationStartedProperties {
  source: "landing" | "composer";
  is_authenticated: boolean;
  locale: SupportedLanguage;
  horizon_preset?: string;
}

export interface PostHogStampSelectedProperties {
  stamp_slug: string;
  category_slug?: string;
  source: "landing" | "composer";
}

export interface PostHogLetterCreationCompletedProperties {
  source: "landing" | "composer";
  has_stamp: boolean;
  predictions_count: number;
  has_emotional_snapshot: boolean;
  horizon_days: number;
  is_authenticated: boolean;
  locale: SupportedLanguage;
}

export interface PostHogLetterSavedProperties {
  letter_id: string;
  status?: string;
  predictions_count?: number;
  matched_predictions_count?: number;
  was_first_reveal?: boolean;
}

export interface PostHogLetterScheduledProperties {
  letter_id: string;
  status?: string;
  language?: SupportedLanguage | string;
  timezone?: string;
  has_stamp?: boolean;
  predictions_count?: number;
  has_emotional_snapshot?: boolean;
  delivery_horizon_days?: number;
}

export interface PostHogLetterSharedProperties {
  letter_id: string;
  share_method: "clipboard" | "native_share" | "link";
  locale?: SupportedLanguage;
}

export interface PostHogLetterViewedProperties {
  letter_id: string;
  status?: string;
  is_locked?: boolean;
  is_opened?: boolean;
}

export interface PostHogAuthProperties {
  auth_method: "magic_link" | "password" | "google" | "facebook";
  locale?: SupportedLanguage | string;
}

export interface PostHogEventMap extends LetterFunnelEventMap {
  letter_creation_started: PostHogLetterCreationStartedProperties;
  stamp_selected: PostHogStampSelectedProperties;
  letter_creation_completed: PostHogLetterCreationCompletedProperties;
  letter_saved: PostHogLetterSavedProperties;
  letter_scheduled: PostHogLetterScheduledProperties;
  letter_shared: PostHogLetterSharedProperties;
  letter_viewed: PostHogLetterViewedProperties;
  user_logged_in: PostHogAuthProperties;
  user_signed_up: PostHogAuthProperties;
}

export type PostHogEventName = keyof PostHogEventMap;

export type AnalyticsEventMap = Ga4EventMap & PostHogEventMap;

export type AnalyticsEventName = keyof AnalyticsEventMap;

export const GA4_EVENTS: ReadonlySet<string> = new Set<Ga4EventName>([
  "page_view",
  "sign_up",
  "login",
  "generate_lead",
  "share",
  "start_letter",
  "select_date",
  "fill_predictions",
  "submit_letter",
  "letter_success",
]);

export const POSTHOG_EVENTS: ReadonlySet<string> = new Set<PostHogEventName>([
  "letter_creation_started",
  "stamp_selected",
  "letter_creation_completed",
  "letter_saved",
  "letter_scheduled",
  "letter_shared",
  "letter_viewed",
  "user_logged_in",
  "user_signed_up",
  "start_letter",
  "select_date",
  "fill_predictions",
  "submit_letter",
  "letter_success",
]);

export const LETTER_FUNNEL_EVENTS: ReadonlySet<string> = new Set<
  keyof LetterFunnelEventMap
>([
  "start_letter",
  "select_date",
  "fill_predictions",
  "submit_letter",
  "letter_success",
]);

export const BACKEND_AUTHORITATIVE_EVENTS: ReadonlySet<string> =
  new Set<PostHogEventName>([
    "letter_saved",
    "letter_scheduled",
    "letter_viewed",
    "user_logged_in",
    "user_signed_up",
  ]);

export function isGa4Event(event: string): event is Ga4EventName {
  return GA4_EVENTS.has(event);
}

export function isPostHogEvent(event: string): event is PostHogEventName {
  return POSTHOG_EVENTS.has(event);
}

export function isBackendAuthoritativeEvent(event: string): boolean {
  return BACKEND_AUTHORITATIVE_EVENTS.has(event);
}

export function isLetterFunnelEvent(
  event: string,
): event is keyof LetterFunnelEventMap {
  return LETTER_FUNNEL_EVENTS.has(event);
}
