"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const privacySections = [
  ["1. Information You Provide", "Mega Chat Live may collect your display name, username, profile image, date of birth, contact details, login credentials, biography, interests, support communications, reports, appeals, payment confirmations, and information submitted for age, host, or agency verification."],
  ["2. Information Collected Automatically", "When you use the service, we may collect your device model, operating system, app version, language, time zone, network type, IP address, device identifiers, login history, room participation, feature interactions, diagnostic logs, crash reports, and security events."],
  ["3. Content, Voice Rooms, and Communications", "We process content you create or share, including profile content, room titles, messages, comments, gifts, and reports. Voice rooms may be public or accessible to participants. Other users may hear, record, or share information you disclose, so you should not share sensitive information in public spaces."],
  ["4. Information From Other Sources", "We may receive information from app stores, payment processors, login providers, analytics or moderation providers, agencies, hosts, and users who report an account or activity. The information received depends on the provider, your relationship with it, and your settings."],
  ["5. How We Use Information", "We use information to create and maintain accounts, operate voice rooms and social features, personalize experiences, process transactions, deliver virtual items, provide support, improve performance, develop features, communicate service updates, and understand how Mega Chat Live is used."],
  ["6. Safety, Moderation, and Fraud Prevention", "We use account, device, transaction, and activity information to verify users, detect spam, investigate reports, prevent payment abuse and reward manipulation, enforce our rules, protect users, preserve evidence, and comply with valid legal requests."],
  ["7. Legal Bases for Processing", "Where applicable, we process information to perform our agreement with you, comply with legal obligations, pursue legitimate interests such as security and product improvement, and act with your consent. You may withdraw consent at any time without affecting processing that was already lawful."],
  ["8. How Information Is Shared", "We may share information with providers supporting cloud hosting, payments, analytics, communications, moderation, customer support, security, and app distribution. We may also disclose information when required by law, necessary to protect rights or safety, directed by you, or connected with a merger, financing, reorganization, or asset transfer."],
  ["9. Public Information", "Your display name, profile image, biography, badges, room activity, follower relationships, rankings, and content you choose to make public may be visible to other users. Public information may also appear in recommendations, search results, or promotional surfaces within the service."],
  ["10. Cookies and Similar Technologies", "Our website and service may use cookies, local storage, software development kits, pixels, and similar technologies to maintain sessions, remember preferences, measure performance, prevent abuse, and understand feature usage. Your browser or device may provide controls for some of these technologies."],
  ["11. Data Retention", "We retain information for as long as reasonably necessary to provide the service and meet safety, fraud prevention, accounting, dispute resolution, and legal obligations. Retention periods vary by data type, account status, and applicable requirements. Some limited records may remain after account deletion where lawfully necessary."],
  ["12. Data Security", "Mega Chat Live uses reasonable administrative, technical, and organizational safeguards designed to protect information. However, no transmission or storage system is completely secure. You are responsible for using a strong password, protecting your login credentials, and promptly reporting suspected unauthorized access."],
  ["13. Your Rights and Controls", "Depending on your location, you may request access, correction, deletion, portability, restriction, or objection to certain processing. You may also withdraw consent, manage communication preferences, and control microphone, camera, contact, notification, or location permissions through your device settings."],
  ["14. Children’s Privacy", "Mega Chat Live is intended only for users aged 18 or older. We do not knowingly collect personal information from anyone under 18. If you believe an underage person has created an account or provided information, contact us so we can investigate and take appropriate action."],
  ["15. International Processing", "Information may be stored or processed in countries other than the country where you live. Where required, Mega Chat Live uses appropriate safeguards for international transfers and handles information in accordance with applicable data-protection law."],
  ["16. Policy Changes and Contact", "We may update this Privacy Policy when our practices, services, or legal obligations change. We will update the effective date and provide additional notice where required. Privacy questions or requests may be sent to hallalive777@gmail.com. We may verify your identity before completing a request."],
];

const termsSections = [
  ["1. Acceptance of Terms", "By accessing or using Mega Chat Live, you agree to these Terms & Conditions and the Privacy Policy. If you do not agree, do not use the service. Additional rules displayed for specific features, events, hosts, agencies, or promotions also apply when you participate."],
  ["2. Eligibility", "You must be at least 18 years old and legally capable of entering an agreement. You must comply with the laws that apply where you live and may not use Mega Chat Live if your access has previously been permanently suspended unless written permission is provided."],
  ["3. Account Registration and Security", "Provide accurate, current information and keep it updated. You may not impersonate another person, create an account without authorization, sell or transfer an account, or conceal a prior suspension. You are responsible for protecting your credentials and for activity under your account."],
  ["4. Acceptable Use", "You may not harass or threaten others, exploit minors, publish unlawful or infringing material, promote violence, distribute malware, scrape data, interfere with the service, evade safety controls, use unauthorized automation, manipulate engagement, commit fraud, or encourage others to violate these terms."],
  ["5. User Content", "You retain ownership rights in content you create. By submitting content, you grant Mega Chat Live a worldwide, non-exclusive, royalty-free license to host, store, reproduce, adapt, display, distribute, and use it as needed to operate, secure, improve, and promote the service. You must have all rights needed to share your content."],
  ["6. Voice Rooms and Moderation", "Room owners and moderators may manage participation, but Mega Chat Live may independently review reports, remove content, restrict rooms, preserve evidence, or take account action. You should not assume that room audio, messages, or social interactions are private unless expressly identified as private."],
  ["7. Virtual Coins, Gifts, and Benefits", "Coins, gifts, badges, VIP status, and other virtual items are limited, revocable licenses to use digital features. They are not legal tender, do not create ownership rights, and cannot be sold or transferred outside approved features. Availability, appearance, utility, and required amounts may change."],
  ["8. Purchases, Billing, and Refunds", "Purchases must use approved channels. Prices, taxes, fees, and exchange rates shown when a purchase is confirmed apply to that transaction. Except where required by law or expressly stated, completed purchases and consumed virtual items are final and non-refundable. Payment providers may apply separate terms."],
  ["9. Subscriptions", "If recurring subscriptions are offered, they renew until canceled through the applicable billing provider. Cancel before the renewal deadline to avoid future charges. Removing the app or closing an account may not automatically cancel a subscription managed by an app store or payment provider."],
  ["10. Hosts, Agencies, and Rewards", "Host and agency participation may require verification, activity, targets, and continued compliance. Rewards are not guaranteed income. Fake, circular, self-funded, refunded, coordinated, or manipulated transactions may be excluded. Mega Chat Live may audit, withhold, reverse, or correct rewards when rules are violated or calculations are incorrect."],
  ["11. Intellectual Property", "The Mega Chat Live software, branding, interface, graphics, features, and original materials are owned by or licensed to Mega Chat Live. You may not copy, modify, reverse engineer, distribute, sell, or commercially exploit them except where permitted by law or written authorization."],
  ["12. Third-Party Services", "App stores, payment services, advertisements, external links, and integrations are operated by third parties and governed by their own terms. Mega Chat Live does not control and is not responsible for third-party content, availability, security, billing decisions, or privacy practices."],
  ["13. Suspension and Termination", "Mega Chat Live may warn, restrict, suspend, or terminate access when reasonably necessary to address violations, safety risk, fraud, legal requirements, chargebacks, system abuse, or threats to the service. Where appropriate, users may be offered an appeal process."],
  ["14. Service Changes and Availability", "Features may be added, changed, suspended, or discontinued. Mega Chat Live does not guarantee uninterrupted availability, compatibility with every device, preservation of every feature, or particular social, promotional, financial, host, or agency outcomes."],
  ["15. Disclaimers and Liability", "The service is provided on an “as available” basis to the extent permitted by law. Mega Chat Live disclaims warranties that may lawfully be excluded. Liability is limited to the maximum extent permitted by applicable law, without limiting consumer or other rights that cannot legally be excluded."],
  ["16. Indemnity and Disputes", "To the extent permitted by law, you are responsible for claims arising from your unlawful use, content, or violation of these terms. Contact support first so the parties can attempt an informal resolution. Nothing in these terms removes dispute rights or remedies that applicable law requires."],
  ["17. General Terms", "If one provision is unenforceable, the remaining provisions continue to apply. Failure to enforce a provision is not a waiver. You may not assign your rights without permission. Mega Chat Live may assign these terms in connection with a reorganization, financing, merger, or transfer of the service."],
  ["18. Changes and Contact", "Mega Chat Live may revise these terms to reflect service, safety, operational, or legal changes. The updated effective date will appear on this page, and additional notice will be provided where required. Questions may be sent to hallalive777@gmail.com."],
];

const theme = {
  page: "bg-[radial-gradient(circle_at_21%_12%,rgba(255,255,255,0.18),transparent_12%),radial-gradient(circle_at_78%_22%,rgba(2,207,255,0.30),transparent_24%),linear-gradient(130deg,#03153f_0%,#064ba8_42%,#087fd1_70%,#05bde9_100%)] bg-size-[180%_180%] text-white",
  hero: "border-[#dca72c]/60 bg-[radial-gradient(circle_at_50%_0%,rgba(14,104,224,0.42),transparent_55%),#020b27]",
  card: "border-[#dca72c]/35 bg-[#04102d]",
  accent: "text-[#ffd34f]",
  muted: "text-white/72",
};

function PolicySection({ title, sections, id }) {
  return (
    <section id={id} className={`min-w-0 scroll-mt-6 rounded-2xl border p-4 min-[380px]:p-5 sm:rounded-3xl sm:p-8 ${theme.card}`}>
      <h2 className={`mb-6 wrap-break-word text-2xl font-black min-[380px]:text-3xl sm:mb-8 sm:text-4xl ${theme.accent}`}>{title}</h2>
      <div className="space-y-7 sm:space-y-8">
        {sections.map(([heading, copy]) => (
          <div key={heading}>
            <h3 className="mb-2 wrap-break-word text-base font-black min-[380px]:text-lg sm:text-xl">{heading}</h3>
            <p className={`wrap-break-word text-[15px] leading-7 sm:text-base sm:leading-8 ${theme.muted}`}>{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function LegalPolicyPage() {
  const [activeTab, setActiveTab] = useState("privacy");

  return (
    <main className={`min-h-screen overflow-x-hidden px-3 py-4 min-[380px]:px-4 sm:px-8 sm:py-6 lg:py-10 ${theme.page}`}>
      <nav className="mx-auto mb-5 flex max-w-295 items-center justify-between gap-3 sm:mb-8">
        <Link href="/" className="flex min-w-0 items-center gap-2 font-black sm:gap-3">
          <Image src="/assets/megalive-logo.png" alt="Mega Chat Live" width={60} height={60} className="h-11 w-11 shrink-0 object-contain sm:h-13 sm:w-13" priority />
          <span className="truncate text-sm min-[380px]:text-base">Mega Chat Live</span>
        </Link>
        <Link className="shrink-0 rounded-full border border-white/30 px-3 py-2 text-[10px] font-black uppercase transition hover:-translate-y-0.5 hover:bg-white/10 min-[380px]:px-4 min-[380px]:text-xs sm:px-5 sm:py-2.5" href="/">Back home</Link>
      </nav>

      <div className="mx-auto max-w-295 space-y-7">
        <header className={`overflow-hidden rounded-3xl border-[#ffd34f] bg-[linear-gradient(135deg,#8d5708,#efbd3c)] px-4 py-8 text-center min-[380px]:px-5 sm:rounded-4xl sm:p-12 ${theme.hero}`}>
          <p className={`mb-3 text-[10px] font-black uppercase tracking-[0.22em] sm:text-xs sm:tracking-[0.3em] ${theme.accent}`}>Legal center</p>
          <h1 className="wrap-break-word text-[clamp(30px,9vw,72px)] font-black leading-[1.02]">Privacy Policy<br /><span className={theme.accent}>&amp; Terms and Conditions</span></h1>
          <p className={`mx-auto mt-5 max-w-190 text-sm leading-6 sm:mt-6 sm:text-base sm:leading-7 ${theme.muted}`}>Learn how Mega Chat Live protects your information and review the rules that apply when using our services.</p>
          <p className={`mt-4 text-sm ${theme.muted}`}>Effective July 12, 2026</p>
        </header>

        <div className={`grid grid-cols-2 gap-2 rounded-2xl border p-2 min-[380px]:gap-3 min-[380px]:p-3 sm:rounded-3xl sm:p-4 ${theme.card}`} role="tablist" aria-label="Legal documents">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "privacy"}
            aria-controls="privacy-policy"
            onClick={() => setActiveTab("privacy")}
            className={`min-h-12 rounded-xl border px-2 py-3 text-center text-xs font-black uppercase leading-tight transition hover:-translate-y-0.5 min-[380px]:text-sm sm:min-h-14 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-lg sm:tracking-wider ${activeTab === "privacy" ? "border-[#ffd34f] bg-[linear-gradient(135deg,#8d5708,#efbd3c)] text-[#020718] shadow-[0_10px_30px_rgba(239,189,60,0.25)]" : `border-[#dca72c]/45 bg-[#020b24] hover:border-[#ffd34f] ${theme.accent}`}`}
          >
            Privacy Policy
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "terms"}
            aria-controls="terms-and-conditions"
            onClick={() => setActiveTab("terms")}
            className={`min-h-12 rounded-xl border px-2 py-3 text-center text-xs font-black uppercase leading-tight transition hover:-translate-y-0.5 min-[380px]:text-sm sm:min-h-14 sm:rounded-2xl sm:px-6 sm:py-4 sm:text-lg sm:tracking-wider ${activeTab === "terms" ? "border-[#ffd34f] bg-[linear-gradient(135deg,#8d5708,#efbd3c)] text-[#020718] shadow-[0_10px_30px_rgba(239,189,60,0.25)]" : `border-[#dca72c]/45 bg-[#020b24] hover:border-[#ffd34f] ${theme.accent}`}`}
          >
            Terms &amp; Conditions
          </button>
        </div>

        <div role="tabpanel" aria-live="polite">
          {activeTab === "privacy" ? (
            <PolicySection id="privacy-policy" title="Privacy Policy" sections={privacySections} />
          ) : (
            <PolicySection id="terms-and-conditions" title="Terms & Conditions" sections={termsSections} />
          )}
        </div>
      </div>
    </main>
  );
}
