import Link from "next/link"
import { pageMetadata } from "@/lib/seo"
import { getLocale } from "@/lib/i18n/server"

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms governing CampCareer, including digital FIFO guide purchases, delivery, consumer remedies, and the informational nature of CampCareer data.",
  path: "/terms",
})

const LAST_UPDATED = "17 August 2026"

export default async function TermsPage() {
  if (await getLocale() === "ko") return <KoreanTermsPage />
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="font-display text-3xl font-semibold text-slate-900 tracking-tight mb-2">Terms of Service</h1>
      <p className="text-sm text-slate-400 mb-10">Last updated: {LAST_UPDATED}</p>

      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">1. Acceptance</h2>
          <p>
            CampCareer is operated by Yaehun Lee (ABN 59 377 057 202) as an Australian sole trader. By using campcareer.com
            (&quot;CampCareer&quot;, the &quot;Service&quot;), you agree to these terms. If you do not agree,
            please do not use the Service. A digital purchase is also subject to the version of these
            terms linked at checkout for that purchase. The Irish address listed in section 12 is a
            current correspondence address and does not mean CampCareer is incorporated or registered
            as an Irish business.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">2. Nature of the data — no advice or outcome guarantee</h2>
          <p>
            Career scores, FIFO entry-path comparisons, salary figures, training costs, tuition costs,
            tax estimates, payback periods, and visa or immigration information shown on CampCareer are
            source-backed data, estimates, market examples, or unavailable fields as labelled in the
            product. They are provided for general information and decision support only and do not
            constitute financial, legal, tax, admissions, immigration, employment, or safety advice.
            We do not guarantee admission, employment, sponsorship, visa approval, permanent residence,
            income, a particular roster, or any other outcome. Always verify critical prices,
            qualifications, licences, employer requirements, and legal requirements with the relevant
            official authority, provider, or employer before paying or applying.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">3. Your account and content</h2>
          <p>
            You are responsible for keeping your account credentials secure and for the content
            you submit, including saved-plan inputs, support requests, and optional feedback
            screenshots. You retain ownership of your content; you grant us only the rights needed
            to store, review, secure, and operate the Service. You must not submit content that is
            unlawful, confidential to another person, or that you do not have the right to share.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">4. Feedback and external links</h2>
          <p>
            Feedback helps us improve the Service but does not create a support obligation or transfer
            ownership of our product. Do not include passwords, passport numbers, payment details, or
            sensitive personal information. Links to official sources, schools, jobs, training providers,
            or other third parties are provided for convenience; those sites control their own content,
            availability, prices, terms, and privacy practices.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">5. Partners, referrals, and affiliate links</h2>
          <p>
            CampCareer may show clearly labelled links to verified schools, agencies, insurers,
            money-transfer providers, communications providers, accommodation services, recruiters,
            or training providers. A commercial relationship never changes the ranking or evidence
            shown in a comparison. We only share a support request with a partner after the specific
            consent shown in that request. Any agreement you enter with a partner is directly with
            that partner.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">6. Digital report purchases, payment, and delivery</h2>
          <p>
            The FIFO Construction Fast Entry Guide 2026 is supplied as a digital PDF for a one-time
            purchase. The product edition, listed price, and checkout currency are shown before you
            authorise payment. The guide is listed in Australian dollars; Stripe may present an
            eligible local-currency amount in its hosted Checkout. The final amount and currency shown
            by Stripe before you confirm payment are the payment terms you authorise. Your bank or card
            provider may apply charges that CampCareer does not control.
          </p>
          <p className="mt-3">
            CampCareer is not currently registered for Australian Goods and Services Tax (GST), so no
            Australian GST is included in the listed A$29 price. This statement concerns Australian GST
            only and does not determine any tax treatment that may apply to a transaction in another
            jurisdiction.
          </p>
          <p className="mt-3">
            Card and payment-method details are entered on Stripe-hosted Checkout. CampCareer treats an
            order as paid only after Stripe confirms the payment through CampCareer&apos;s verified payment
            processing flow. After verified payment, we attempt prompt delivery to the email address
            supplied for the purchase using a private, expiring download link. The current delivery link
            is issued for approximately 24 hours. If the link expires, the email does not arrive, or the
            file cannot be accessed, contact us so we can verify the purchase and provide an appropriate
            delivery remedy.
          </p>
          <p className="mt-3">
            A purchase gives you a personal, non-exclusive, non-transferable right to use the purchased
            edition for your own reference. You must not resell, republish, mass-distribute, or make the
            paid guide publicly available. Unless the sales page expressly says otherwise, buying one
            edition does not include future editions or a promise that market data will remain current.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">7. Immediate digital delivery, cancellation, and refunds</h2>
          <p>
            Before CampCareer creates a new FIFO guide Checkout Session, the purchase form asks you to
            request immediate supply of the digital guide after verified payment and to acknowledge the
            related withdrawal-right notice. Where applicable law permits, a change-of-mind withdrawal
            right may end once the digital content has been supplied after that request and acknowledgement.
          </p>
          <p className="mt-3">
            This does not remove rights that cannot lawfully be excluded. For Australian consumers, nothing
            in these terms excludes or restricts consumer guarantees or remedies that apply under the
            Australian Consumer Law. If mandatory consumer protections in another jurisdiction apply to your
            purchase, those protections are also preserved. If digital content is not supplied, is materially
            faulty, does not conform to the purchase description, or another statutory remedy applies, you may
            be entitled to re-supply, repair, a price reduction, refund, cancellation, or another remedy under
            applicable consumer law. CampCareer does not use these terms to impose a blanket &quot;no refunds&quot;
            rule. We may verify the relevant order and payment before providing a remedy. Where a refund is
            due, it will be processed through the original payment channel unless applicable law or an
            agreement with you requires another method.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">8. Report launch updates and personalised reports</h2>
          <p>
            A report launch-update request is not a purchase, booking, reservation, or payment instruction.
            Personalised reports and other CampCareer reports are evidence-based decision aids, not automated
            visa-eligibility determinations or guarantees of admission, employment, salary, permanent
            residency, or investment return. Expert review may not provide regulated immigration, legal,
            financial, or education-agent advice unless the assigned expert is appropriately authorised and
            the applicable service terms say otherwise.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">9. Acceptable use</h2>
          <p>
            You agree not to abuse the Service — including attempting to access other users&apos; data,
            bypassing paid-content access controls, scraping at volumes that degrade the Service, or
            interfering with its operation.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">10. Availability and changes</h2>
          <p>
            Except for guarantees, rights, or remedies that cannot be excluded under applicable law, the
            Service is provided on an &quot;as available&quot; basis and features may be modified, suspended, or
            discontinued. We may update these terms as the Service changes. The terms governing a completed
            digital purchase are the version presented or linked for that purchase; a later update does not
            retroactively remove statutory rights relating to an earlier purchase.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">11. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by law, CampCareer is not liable for decisions made in reliance
            on estimated or time-sensitive information, or for indirect or consequential losses arising from
            use of the Service. Nothing in these terms excludes or limits liability, guarantees, consumer
            rights, or remedies that applicable law does not allow us to exclude or limit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-slate-800 mb-2">12. Business identity, contact, and purchase support</h2>
          <p>
            CampCareer is operated by Yaehun Lee (ABN 59 377 057 202), an Australian sole trader. For terms,
            guide-delivery, purchase, or consumer-remedy questions, our preferred contact channel is{" "}
            <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>.
          </p>
          <p className="mt-3">
            Current correspondence address: 17 Cruise Park Ave, Tyrrelstown, Dublin 15, D15 EY8X, Ireland.
            Phone: <a href="tel:+353892678444" className="text-blue-600 hover:underline">+353 89 267 8444</a>.
            The correspondence address and phone number are provided for customer contact while the operator
            is temporarily in Ireland; they do not change CampCareer&apos;s Australian business registration.
          </p>
        </section>
      </div>

      <div className="mt-12 pt-6 border-t border-slate-200 text-sm">
        <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
      </div>
    </div>
  )
}

function KoreanTermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="font-display text-3xl font-semibold tracking-tight text-slate-900">이용약관</h1>
      <p className="mb-10 mt-2 text-sm text-slate-400">최종 업데이트: 2026년 8월 17일</p>
      <div className="space-y-8 text-sm leading-relaxed text-slate-600">
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">1. 약관 동의</h2><p>CampCareer는 Yaehun Lee(ABN 59 377 057 202)가 호주 개인사업자(sole trader)로 운영합니다. campcareer.com과 CampCareer 서비스를 이용하면 본 약관에 동의하게 됩니다. 동의하지 않으면 서비스를 이용하지 마세요. 디지털 상품 구매에는 해당 구매 시 Checkout에서 연결된 약관 버전이 함께 적용됩니다. 제12조의 아일랜드 주소는 현재 우편·연락용 주소이며 CampCareer가 아일랜드 법인 또는 아일랜드 사업자로 등록되었다는 의미가 아닙니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">2. 데이터의 성격과 비조언·비보장 고지</h2><p>커리어 점수, FIFO 진입 경로 비교, 연봉, 교육비, 학비, 세금 추정, 투자회수기간, 비자·이민 정보는 출처 기반 데이터·추정치·시장 예시·미확인 항목으로 표시됩니다. 이는 일반 정보와 의사결정 보조 자료이며 금융·법률·세무·입학·이민·고용·안전 자문이 아닙니다. CampCareer는 입학, 취업, 스폰서십, 비자 승인, 영주권, 소득, 특정 로스터나 기타 결과를 보장하지 않습니다. 실제 결제·지원 전에는 가격, 자격, 라이선스, 고용주 요건과 법적 요건을 공식 기관·제공자·고용주에게 다시 확인해야 합니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">3. 계정과 제출 정보</h2><p>이용자는 계정 자격증명과 본인이 제출하는 저장 계획·지원 요청·피드백의 책임을 집니다. 이용자는 자신의 콘텐츠 권리를 보유하며, CampCareer에는 서비스 보관·검토·보안·운영에 필요한 범위의 권한만 부여합니다. 타인의 기밀 정보나 공유 권한이 없는 정보를 제출해서는 안 됩니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">4. 피드백과 외부 링크</h2><p>피드백은 서비스 개선에 사용되지만 별도의 지원 의무를 만들지 않습니다. 비밀번호, 여권번호, 결제 정보, 민감한 개인정보를 포함하지 마세요. 공식 출처·학교·채용·교육기관·제3자 링크는 편의를 위한 것이며 외부 사이트의 내용·가용성·가격·약관·개인정보 처리는 해당 사이트가 책임집니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">5. 파트너·추천·제휴 링크</h2><p>CampCareer는 검증된 학교, 에이전시, 보험, 송금, 통신, 숙소, 리크루터, 교육기관 등의 링크를 명확히 표시할 수 있습니다. 상업적 관계는 순위나 근거를 바꾸지 않습니다. 이용자가 요청 화면에서 특정 동의한 경우에만 지원 요청을 파트너와 공유합니다. 파트너와 맺는 계약은 이용자와 파트너 간의 직접 계약입니다.</p></section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">6. 디지털 리포트 구매·결제·전달</h2>
          <p>FIFO Construction Fast Entry Guide 2026은 일회성으로 구매하는 디지털 PDF입니다. 상품 에디션, 표시 가격과 결제 통화는 결제 승인 전에 표시됩니다. 가이드는 호주 달러 기준으로 표시되며, Stripe hosted Checkout에서 대상 고객에게 현지 통화 금액이 표시될 수 있습니다. 결제 확정 직전 Stripe 화면에 표시되는 최종 금액과 통화가 이용자가 승인하는 결제 조건입니다. 은행이나 카드사가 별도의 환전·결제 수수료를 부과할 수 있으며 CampCareer는 이를 통제하지 않습니다.</p>
          <p className="mt-3">CampCareer는 현재 호주 GST(Goods and Services Tax)에 등록되어 있지 않으므로 표시된 A$29 가격에는 호주 GST가 포함되어 있지 않습니다. 이 설명은 호주 GST에 관한 것이며 다른 국가에서 거래에 적용될 수 있는 세금 처리를 결정하는 문구는 아닙니다.</p>
          <p className="mt-3">카드 및 결제수단 정보는 Stripe hosted Checkout에서 입력합니다. CampCareer는 Stripe가 검증된 결제 처리 흐름을 통해 결제 완료를 확인한 뒤에만 주문을 결제 완료로 처리합니다. 확인 후 구매 시 입력한 이메일로 비공개 만료형 다운로드 링크를 신속히 전달하려고 시도합니다. 현재 다운로드 링크는 생성 시점부터 약 24시간 동안 유효합니다. 링크가 만료되거나 이메일이 도착하지 않거나 파일 접근에 문제가 있으면 구매 확인 후 적절한 전달 조치를 할 수 있도록 문의해 주세요.</p>
          <p className="mt-3">구매자는 구매한 에디션을 개인 참고 목적으로 사용할 수 있는 비독점적·양도 불가능한 이용권을 받습니다. 유료 가이드를 재판매·재게시·대량 배포하거나 공개적으로 제공해서는 안 됩니다. 판매 페이지에서 별도로 명시하지 않는 한 한 에디션의 구매에 향후 에디션이나 시장 데이터의 지속 업데이트가 포함되지는 않습니다.</p>
        </section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">7. 즉시 디지털 전달·철회·환불</h2>
          <p>새 FIFO 가이드 Checkout Session을 만들기 전에 구매 폼에서 결제 확인 후 디지털 가이드를 즉시 제공해 달라는 요청과 관련 철회권 고지를 확인하도록 합니다. 적용 법률이 허용하는 경우 이 요청과 확인 후 디지털 콘텐츠가 제공되면 단순 변심에 따른 철회권이 종료될 수 있습니다.</p>
          <p className="mt-3">이는 법적으로 배제할 수 없는 권리를 없애지 않습니다. 호주 소비자에게는 Australian Consumer Law에 따른 소비자 보증과 구제 권리를 본 약관이 배제하거나 제한하지 않습니다. 다른 국가의 강행 소비자 보호 규정이 구매에 적용되는 경우 해당 권리도 유지됩니다. 디지털 콘텐츠가 제공되지 않거나 중대한 하자가 있거나 구매 설명과 일치하지 않거나 기타 법정 구제 사유가 있는 경우 재제공, 수정, 가격 인하, 환불, 계약 종료 또는 적용 법률상 다른 구제를 받을 권리가 있을 수 있습니다. CampCareer는 본 약관으로 일률적인 “환불 불가” 규칙을 적용하지 않습니다. 구제 전 관련 주문과 결제를 확인할 수 있으며, 환불이 필요한 경우 적용 법률이나 별도 합의가 요구하지 않는 한 원래 결제 경로를 통해 처리합니다.</p>
        </section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">8. 리포트 출시 알림과 개인화 리포트</h2><p>출시 알림 신청은 구매, 예약, 좌석 확보, 결제 지시가 아닙니다. 개인화 리포트와 기타 CampCareer 리포트는 근거 기반 의사결정 보조 자료이며 자동 비자 자격 판정이나 입학·취업·연봉·영주권·투자수익 보장이 아닙니다. 전문가 검토 역시 담당 전문가가 적절히 자격을 갖추고 해당 서비스 조건에서 허용한 경우를 제외하면 규제 대상 이민·법률·금융·교육 에이전트 자문을 제공하지 않습니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">9. 허용되는 이용</h2><p>다른 이용자의 데이터에 접근하거나, 유료 콘텐츠 접근 통제를 우회하거나, 서비스를 저해할 정도로 자동 수집을 하거나, 서비스 운영을 방해해서는 안 됩니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">10. 가용성과 변경</h2><p>적용 법률상 배제할 수 없는 보증·권리·구제를 제외하고 서비스는 이용 가능한 상태를 기준으로 제공되며 기능은 수정·중단될 수 있습니다. 서비스 변경에 따라 약관을 업데이트할 수 있습니다. 완료된 디지털 구매에는 해당 구매 시 제시되거나 연결된 약관 버전이 적용되며 이후 약관 변경으로 이전 구매의 법정 권리를 소급해 제거하지 않습니다.</p></section>
        <section><h2 className="font-display mb-2 text-lg font-semibold text-slate-800">11. 책임 제한</h2><p>법이 허용하는 최대 범위에서 CampCareer는 추정치나 시의성이 있는 정보에 의존해 내린 결정 또는 서비스 이용으로 발생한 간접·결과적 손실에 책임지지 않습니다. 본 약관은 적용 법률이 배제·제한을 허용하지 않는 책임, 보증, 소비자 권리 또는 구제를 배제하거나 제한하지 않습니다.</p></section>
        <section>
          <h2 className="font-display mb-2 text-lg font-semibold text-slate-800">12. 사업자 정보·연락처·구매 지원</h2>
          <p>CampCareer는 Yaehun Lee(ABN 59 377 057 202)가 호주 개인사업자로 운영합니다. 약관, 가이드 전달, 구매 또는 소비자 구제 문의의 우선 연락처는 <a href="mailto:contact@campcareer.com" className="text-blue-600 hover:underline">contact@campcareer.com</a>입니다.</p>
          <p className="mt-3">현재 우편 연락 주소: 17 Cruise Park Ave, Tyrrelstown, Dublin 15, D15 EY8X, Ireland. 전화: <a href="tel:+353892678444" className="text-blue-600 hover:underline">+353 89 267 8444</a>. 이 주소와 전화번호는 운영자가 아일랜드에 일시 체류하는 동안 고객 연락을 위해 제공되며 CampCareer의 호주 사업자 등록을 변경하는 정보가 아닙니다.</p>
        </section>
      </div>
      <div className="mt-12 border-t border-slate-200 pt-6 text-sm"><Link href="/ko/privacy" className="text-blue-600 hover:underline">개인정보 처리방침</Link></div>
    </div>
  )
}