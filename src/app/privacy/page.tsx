import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { getLocale } from "@/lib/i18n/server"

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How CampCareer handles account, purchase, payment-state, delivery, consent, saved-plan, and product analytics data.",
  path: "/privacy",
})

const LAST_UPDATED = "17 August 2026"

export default async function PrivacyPage() {
  if (await getLocale() === "ko") return <KoreanPrivacyPage />
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900 tracking-tight mb-2">Privacy Policy</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">1. Who we are</h2>
          <p>
            CampCareer (&quot;we&quot;, &quot;us&quot;) is operated by Yaehun Lee as an Australian business and
            provides study, career, work-pathway, and related decision-support products at campcareer.com.
            Yaehun Lee is responsible for the personal data described in this policy and, where EU or UK
            data-protection law applies, acts as the controller. This policy explains what personal data we
            collect, why we collect it, how long we keep it, the service providers involved, and the choices
            you have. For privacy questions or rights requests, our preferred contact is{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>.
          </p>
          <p className="mt-3">
            Current correspondence address: 17 Cruise Park Ave, Tyrrelstown, Dublin 15, D15 EY8X, Ireland.
            Phone: <a href="tel:+353892678444" className="text-blue-600 hover:underline">+353 89 267 8444</a>.
            These are current contact details while the operator is temporarily in Ireland and do not change
            CampCareer&apos;s Australian business registration.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">2. Data we collect</h2>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Account data</strong> — email address and authentication identifiers when
              you create an account or sign in.
            </li>
            <li>
              <strong>Decision inputs</strong> — origin country, study concept, budget, currency,
              and product priority used to calculate or save a decision plan.
            </li>
            <li>
              <strong>Australia report preparation</strong> — the age range, education and work
              summary, English level, budget, scholarship expectation, family and city preferences,
              target occupation, risk preference, report language, and up to three saved options
              you choose to store for a personalised Australia report. We do not request passport,
              visa, payment-card, or health information for this purpose.
            </li>
            <li>
              <strong>Report launch updates</strong> — your email address, selected Australia
              report types, language, consent time, and optional attribution fields when you ask to
              be notified of a report launch. The update is inactive until you confirm the email.
            </li>
            <li>
              <strong>FIFO guide purchases</strong> — the guide-delivery email; checkout-attempt and
              order identifiers; product and edition; amount and currency; payment and delivery status;
              Stripe Price, Checkout Session, Payment Intent, Customer, and event identifiers when
              available; purchase and delivery timestamps; delivery-attempt state; the transactional
              email provider message identifier; short non-PII delivery error codes; your optional
              marketing preference; and the recorded version and time of the immediate digital-delivery
              request, withdrawal-right acknowledgement, Terms of Service, and Privacy Policy shown
              before checkout. Full card numbers and card security codes are entered on Stripe-hosted
              Checkout and are not submitted directly to the CampCareer application or stored in the
              CampCareer order table.
            </li>
            <li>
              <strong>Saved plans</strong> — the recommendation snapshot, source and engine
              versions, and recalculation history you explicitly save.
            </li>
            <li>
              <strong>Consent records</strong> — separate records for saving a plan, optional policy
              or marketing alerts, measurement choices, and any purchase-specific acknowledgement.
              Purchase and delivery do not require marketing consent.
            </li>
            <li>
              <strong>Application-support requests</strong> — your name, account email, selected
              study option, destination, optional intake and budget, requested help, consent time,
              and request status when you ask to be connected with a verified school or agency.
              We do not share this request with a partner until you give the specific consent shown
              in that request form.
            </li>
            <li>
              <strong>Usage analytics</strong> — page views, performance measurements, and
              allow-listed product events collected with Vercel Analytics and Speed Insights.
              Product events may include origin country, concept ID, destination, locale, surface,
              and low-cardinality status or reason values, but never purchase email addresses or
              free-text responses.
            </li>
            <li>
              <strong>Country launch requests</strong> — the destination you request and a
              one-way digest of a browser-generated request identifier so we can deduplicate
              demand signals. We do not collect your email address, IP address, or user-agent
              for this feature.
            </li>
            <li>
              <strong>Feedback reports</strong> — the category and text you submit, plus an email
              address only if you opt in to follow-up. If you separately opt in, we may attach the
              page path, locale, time zone, browser user-agent, and viewport size to help reproduce
              a fault. Uploaded screenshots are stored privately and are not made public or shared
              with partners.
            </li>
            <li>
              <strong>Community contributions</strong> — the contribution type, page or topic,
              text, optional source link, moderation status and reviewer note when you submit a
              review, correction or source suggestion. Approved contributions create a private
              reputation ledger entry. We do not publish your identity or contribution in this
              first release.
            </li>
            <li>
              <strong>Programme completion and portfolio data</strong> — the private snapshot of
              planning records used when you complete a CampCareer programme, and the current
              careers, providers and courses shown in your private portfolio. This is not an
              academic, immigration or employment credential.
            </li>
            <li>
              <strong>Programme evidence links</strong> — programme labels, official source URLs
              and notes you save for your private Verify step. Saving a link does not mean that
              CampCareer, a provider or a regulator has approved it.
            </li>
            <li>
              <strong>Optional measurement and attribution</strong> — after you choose “Allow
              measurement”, we store a short-lived session identifier, first page path, and UTM
              campaign fields to measure product and partner-link performance. We do not create
              these attribution cookies when you choose “Essential only”.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">3. How we store, protect, and retain data</h2>
          <p>
            Personal records are stored with our infrastructure providers (see section 4). Saved
            decision plans are protected by owner-only row-level security and are readable only by
            the authenticated account that owns them. FIFO purchase records are server-managed and
            are not directly readable or writable by public browser roles. The master FIFO guide is
            held in private storage. After verified payment, CampCareer creates a short-lived signed
            download URL; the current link lifetime is approximately 24 hours, and the stored signed
            URL is cleared from the order record after delivery is completed. Data is encrypted in
            transit and at rest by our providers.
          </p>
          <p className="mt-3">
            Core FIFO purchase, payment-state, consent-version, delivery, refund, dispute, and accounting
            records are normally retained for up to six years after the relevant transaction or accounting
            period, or longer where reasonably necessary for an unresolved dispute, chargeback, fraud or
            security investigation, tax requirement, or other legal obligation. Checkout URLs and other
            operational secrets are used only for checkout or delivery operations and are not intended as
            public records.
          </p>
          <p className="mt-3">
            Save-intent tokens expire after 24 hours. Saved plans are retained while your account remains
            active or until you request deletion. Feedback reports and private screenshots are retained for
            up to 180 days unless a longer period is necessary to investigate abuse, security, or a legal
            claim. Optional attribution cookies expire after 30 days; measurement-consent choices expire
            after 180 days. Community contribution, reputation, programme completion, private portfolio,
            and programme evidence-link records are retained while your account remains active and are
            deleted with your account unless retention is necessary for abuse, security, or a legal claim.
            Australia report-preparation records are retained for up to 12 months after your last save unless
            you delete your account or request earlier deletion. Confirmed report-launch updates are retained
            for up to 12 months; unsubscription marks them for removal by the daily retention job.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">4. Service providers and recipients</h2>
          <p>We use the following service providers to operate CampCareer:</p>
          <ul className="list-disc pl-5 space-y-1.5 mt-2">
            <li><strong>Supabase</strong> — database and authentication.</li>
            <li><strong>Supabase Storage</strong> — private product files and private feedback screenshots.</li>
            <li><strong>Vercel</strong> — application hosting and privacy-controlled product analytics.</li>
            <li><strong>Stripe</strong> — hosted checkout and payment processing. Payment information entered on Stripe-hosted Checkout is processed by Stripe under Stripe&apos;s applicable terms and privacy notices.</li>
            <li><strong>Resend</strong> — transactional purchase delivery messages and separately consented alerts.</li>
          </ul>
          <p className="mt-2">
            These providers process data to provide their respective infrastructure, payment, delivery,
            and communications functions. Their own legal roles and privacy obligations may also apply to
            processing they perform for their services.
          </p>
          <p className="mt-2">
            If you submit an application-support request, the verified school or agency assigned to that
            request becomes an independent recipient of the information you explicitly agreed to share.
            Sponsored placement never changes comparison or course ranking.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">5. Purposes, legal bases, and international transfers</h2>
          <p>
            We process account and saved-plan data to provide the Service you request. For a paid digital
            guide, we process purchase email, order state, payment identifiers, delivery state, and the
            purchase-specific acknowledgement record as necessary to take steps requested before purchase,
            perform the purchase and delivery contract, support the transaction, and establish what terms
            were presented. We retain transaction information where necessary to meet accounting, tax,
            dispute, and other legal obligations. We use legitimate interests where permitted for security,
            fraud prevention, reliability, abuse prevention, and limited product measurement. Optional
            marketing, feedback follow-up, partner sharing, alerts, and optional measurement rely on consent
            where consent is the applicable basis. Marketing consent is separate from purchase and delivery.
          </p>
          <p className="mt-3">
            Our providers may process data outside your country. Where required, we rely on the provider&apos;s
            applicable transfer safeguards and data-processing terms. Do not submit special-category personal
            data, passport numbers, passwords, or payment-card data in feedback or free-text fields.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">6. Your rights and deletion requests</h2>
          <p>
            Depending on where you live (including under the EU/UK GDPR), you may have the right to access,
            correct, export, restrict, object to certain processing of, or delete your personal data. You can
            manage your profile and delete saved content where the product provides a delete control. You can
            also permanently delete your account in <Link href="/settings" className="text-blue-600 hover:underline">Account settings</Link>.
            For an access, correction, deletion, objection, or export request, email{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>{" "}
            from an address we can use to verify the request. We aim to action verified requests within the
            period required by applicable law. Some purchase, payment, security, tax, dispute, or accounting
            records may need to be retained despite an account-deletion request where a legal basis requires
            or permits that retention. Depending on your location, you may also have the right to complain to
            your local data-protection authority.
          </p>
        </section>

        <section id="cookies-and-measurement">
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">7. Cookies, Stripe Checkout, and measurement choices</h2>
          <p>
            We use strictly necessary cookies or browser storage for authentication sessions, interface state,
            and checkout continuity. Optional product measurement and attribution begin only after you choose
            “Allow measurement” in the privacy control. Vercel&apos;s current analytics configuration is used
            without Google Analytics or third-party advertising cookies. When you follow the secure checkout
            link to Stripe-hosted Checkout, you are on Stripe&apos;s service and Stripe may use cookies, Link, or
            related browser technologies under its own notices and settings. Partner links may carry an
            affiliate identifier after you choose to open that partner&apos;s site; the partner&apos;s own privacy policy
            then applies. You can change the CampCareer measurement choice in Account settings; choosing
            essential functionality only clears CampCareer&apos;s optional measurement cookies.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">8. Children and changes to this policy</h2>
          <p>
            CampCareer is not designed for children under 16. We review this policy when our processing
            changes and may update it as the product evolves. Material changes will be shown on this page
            with an updated &quot;last updated&quot; date.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm">
        <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
      </div>
    </div>
  )
}

function KoreanPrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">개인정보 처리방침</h1>
      <p className="mb-10 mt-2 text-sm text-slate-400">최종 업데이트: 2026년 8월 17일</p>
      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">1. 운영 주체와 문의</h2>
          <p>CampCareer는 Yaehun Lee가 호주 사업자로 운영하는 유학·커리어·취업 경로 의사결정 서비스입니다. Yaehun Lee는 이 방침에서 설명하는 개인정보에 대한 책임을 지며, EU 또는 영국 개인정보 보호법이 적용되는 경우 개인정보 처리의 컨트롤러 역할을 합니다. 이 방침은 어떤 정보를 왜 수집하고, 얼마나 보관하며, 어떤 서비스 제공업체를 사용하고, 이용자에게 어떤 선택권이 있는지 설명합니다. 개인정보 관련 문의나 권리 요청의 우선 연락처는 <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>입니다.</p>
          <p className="mt-3">현재 우편 연락 주소: 17 Cruise Park Ave, Tyrrelstown, Dublin 15, D15 EY8X, Ireland. 전화: <a href="tel:+353892678444" className="text-blue-600 hover:underline">+353 89 267 8444</a>. 이 연락처는 운영자가 아일랜드에 일시 체류하는 동안 사용하는 현재 연락 정보이며 CampCareer의 호주 사업자 등록을 변경하는 정보가 아닙니다.</p>
        </section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">2. 수집하는 정보</h2>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><strong>계정 정보</strong> — 회원가입·로그인에 필요한 이메일과 인증 식별자</li>
            <li><strong>의사결정 입력값과 저장 계획</strong> — 국가, 전공·직업, 예산, 우선순위, 저장한 후보와 다음 할 일</li>
            <li><strong>호주 개인화 리포트 준비 정보</strong> — 나이 범위, 학력·경력 요약, 영어 수준, 예산·장학금 예상, 가족·도시 선호, 목표 직업, 위험 선호, 리포트 언어와 최대 3개의 선택지</li>
            <li><strong>리포트 출시 알림</strong> — 이메일, 관심 리포트, 언어, 동의 시점과 선택적 유입 정보. 이메일 확인 전에는 알림이 활성화되지 않습니다.</li>
            <li><strong>FIFO 가이드 구매 정보</strong> — 전달 이메일, Checkout 시도·주문 식별자, 상품·에디션, 금액·통화, 결제·전달 상태, 존재하는 경우의 Stripe Price·Checkout Session·Payment Intent·Customer·event 식별자, 구매·전달 시점, 전달 시도 상태, 거래성 이메일 메시지 식별자, 개인정보를 포함하지 않는 짧은 오류 코드, 선택적 마케팅 선호도, 그리고 결제 전 표시된 즉시 디지털 전달 요청·철회권 고지·이용약관·개인정보 처리방침의 확인 시점과 버전. 카드 전체 번호와 보안코드는 Stripe hosted Checkout에 입력되며 CampCareer 애플리케이션으로 직접 제출되거나 CampCareer 주문 테이블에 저장되지 않습니다.</li>
            <li><strong>선택적 분석 정보</strong> — 측정 허용 시에만 생성되는 짧은 세션 식별자, 첫 방문 경로, UTM 캠페인 값과 허용된 저카디널리티 제품 이벤트. 구매 이메일이나 자유 입력 내용은 분석 이벤트에 넣지 않습니다.</li>
            <li><strong>피드백·지원 요청</strong> — 사용자가 직접 제출한 범주, 내용, 후속 연락 동의와 필요한 경우의 비공개 스크린샷</li>
          </ul>
          <p className="mt-2">여권번호, 비자 서류, 비밀번호, 결제카드 정보, 건강 정보는 피드백이나 리포트 준비의 자유 입력란에 제출하지 마세요.</p>
        </section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">3. 보관·보호·삭제</h2>
          <p>계정과 저장 계획은 소유자 접근 통제로 보호합니다. FIFO 구매 기록은 서버에서 관리하며 일반 브라우저 역할이 직접 읽거나 수정할 수 없습니다. 마스터 PDF는 비공개 저장소에 보관합니다. 결제 확인 후 생성되는 다운로드 링크는 현재 약 24시간 동안 유효하며, 전달 완료 후 주문 레코드에 저장된 서명 URL은 삭제됩니다. 데이터는 서비스 제공업체의 전송·저장 암호화 보호를 사용합니다.</p>
          <p className="mt-3">핵심 FIFO 구매·결제 상태·구매 확인 버전·전달·환불·분쟁·회계 기록은 일반적으로 관련 거래 또는 회계 기간 후 최대 6년 보관하며, 미해결 분쟁·차지백·사기 또는 보안 조사·세무·기타 법적 의무가 있는 경우 필요한 범위에서 더 오래 보관할 수 있습니다. 개인화 리포트 준비 정보는 마지막 저장 후 최대 12개월, 확인된 출시 알림은 최대 12개월, 피드백과 비공개 스크린샷은 원칙적으로 최대 180일 보관합니다. 선택적 유입 쿠키는 30일, 측정 동의 선택은 180일 후 만료됩니다.</p>
        </section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">4. 처리업체와 제3자</h2>
          <p>서비스 운영을 위해 Supabase(데이터베이스·인증), Supabase Storage(비공개 상품 파일·피드백 스크린샷), Vercel(호스팅·선택형 분석), Stripe(hosted Checkout·결제 처리), Resend(구매 전달 및 별도 동의된 이메일)를 사용합니다. Stripe Checkout에 입력한 결제 정보에는 Stripe의 해당 약관과 개인정보 고지가 적용됩니다. 학교나 에이전시에 지원 도움을 요청한 경우에는 해당 요청 화면에서 별도로 동의한 정보만 파트너에게 공유합니다.</p>
        </section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">5. 처리 목적과 국제 이전</h2>
          <p>계정과 저장 계획은 요청한 서비스 제공을 위해 처리합니다. 유료 디지털 가이드의 구매 이메일, 주문·결제·전달 상태와 구매별 확인 기록은 구매 전 요청한 절차 수행, 구매·전달 계약 이행, 거래 지원과 당시 제시된 조건의 입증을 위해 처리합니다. 회계·세무·분쟁 등 법적 의무에 필요한 거래 기록은 해당 의무를 근거로 보관합니다. 보안·사기 방지·신뢰성·남용 방지와 허용된 제한적 측정에는 허용되는 범위의 정당한 이익을 사용하며, 선택적 마케팅·피드백 후속 연락·파트너 공유·선택적 측정은 해당되는 경우 동의를 근거로 합니다. 마케팅 동의는 구매와 전달과 별개입니다. 서비스 제공업체가 이용자 국가 밖에서 데이터를 처리하는 경우 필요한 이전 보호조치를 적용합니다.</p>
        </section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">6. 이용자의 권리</h2>
          <p>거주 지역에 따라 열람, 정정, 내보내기, 삭제, 처리 제한 또는 특정 처리에 대한 이의를 요청할 수 있습니다. 계정은 <Link href="/ko/settings" className="text-blue-600 hover:underline">계정 설정</Link>에서 삭제할 수 있으며, 그 밖의 요청은 확인 가능한 이메일 주소에서 <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>으로 보내주세요. 구매·결제·보안·세무·분쟁·회계 기록은 법적 근거가 있는 경우 계정 삭제 요청 후에도 필요한 기간 동안 보관될 수 있습니다. 거주 지역에 따라 관할 개인정보 감독기관에 민원을 제기할 권리도 있을 수 있습니다.</p>
        </section>
        <section id="cookies-and-measurement">
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">7. 쿠키·Stripe Checkout·측정 선택</h2>
          <p>인증, 화면 상태, Checkout 연속성을 위해 필수 쿠키나 브라우저 저장소를 사용합니다. 제품 측정·유입 분석은 “측정 허용”을 선택한 뒤에만 시작하며 Google Analytics나 제3자 광고 쿠키는 사용하지 않습니다. 보안 결제 링크를 따라 Stripe hosted Checkout으로 이동하면 Stripe 서비스가 적용되며 Stripe는 자체 고지와 설정에 따라 쿠키, Link 또는 관련 브라우저 기술을 사용할 수 있습니다. CampCareer의 측정 선택은 계정 설정에서 바꿀 수 있습니다.</p>
        </section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">8. 아동과 변경 사항</h2><p>CampCareer는 16세 미만 아동을 대상으로 설계되지 않았습니다. 개인정보 처리 방식이 바뀌면 이 방침을 검토하고, 중요한 변경은 이 페이지의 업데이트 날짜와 함께 표시합니다.</p></section>
      </div>
      <div className="mt-12 border-t border-slate-200 pt-6 text-sm"><Link href="/ko/terms" className="text-blue-600 hover:underline">이용약관</Link></div>
    </div>
  )
}