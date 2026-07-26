"use client"

import { useState } from "react"
import { BookOpen, MessageCircle, Mic, Copy, Check, ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

const DAILY_EXPRESSIONS = [
  {
    category: "Daily life",
    ko: "일상 대화",
    items: [
      { en: "How's it going?", ko: "어떻게 지내?", context: "Casual greeting" },
      { en: "Not too bad, you?", ko: "그럭저럭, 너는?", context: "Casual reply" },
      { en: "No worries.", ko: "괜찮아.", context: "Very common Australian phrase" },
      { en: "Good on ya!", ko: "잘했어!", context: "Praise or thanks" },
      { en: "See you around.", ko: "또 봐.", context: "Casual goodbye" },
      { en: "I'm keen.", ko: "관심 있어.", context: "Expressing interest" },
    ],
  },
  {
    category: "Asking for help",
    ko: "도움 요청",
    items: [
      { en: "Could you give me a hand?", ko: "도와줄 수 있어?", context: "Polite request" },
      { en: "Sorry, I didn't catch that.", ko: "미안, 그거 못 들었어.", context: "When you didn't hear" },
      { en: "Could you say that again?", ko: "다시 말해줄 수 있어?", context: "Polite repetition request" },
      { en: "How do I get to...?", ko: "...에 어떻게 가?", context: "Asking for directions" },
      { en: "Where can I find...?", ko: "...어디서 찾을 수 있어?", context: "Finding something" },
      { en: "Is there a shortcut?", ko: "지름길 있어?", context: "Asking for faster route" },
    ],
  },
  {
    category: "University life",
    ko: "대학 생활",
    items: [
      { en: "When is the assignment due?", ko: "과제 언제Due야?", context: "Assignment deadline" },
      { en: "Can I get an extension?", ko: "기한 연장 가능해?", context: "Requesting more time" },
      { en: "Where's the library?", ko: "도서관 어디야?", context: "Campus directions" },
      { en: "What's the grading criteria?", ko: "성적 기준이 뭐야?", context: "Understanding assessment" },
      { en: "I'm not sure I understand.", ko: "이해가 안 돼.", context: "Being honest in class" },
      { en: "Could you explain that again?", ko: "다시 설명해줄 수 있어?", context: "Asking for clarification" },
    ],
  },
  {
    category: "Making friends",
    ko: "친구 사귀기",
    items: [
      { en: "What do you do for fun?", ko: "취미가 뭐야?", context: "Getting to know someone" },
      { en: "Want to grab a coffee?", ko: "커피 마실래?", context: "Casual invitation" },
      { en: "Let's catch up soon.", ko: "얼른 만나자.", context: "Making plans" },
      { en: "That's awesome!", ko: "대박 멋지다!", context: "Showing enthusiasm" },
      { en: "No way! Me too!", ko: "헐! 나도!", context: "Finding common ground" },
      { en: "I'll text you.", ko: "문자할게.", context: "Ending a conversation" },
    ],
  },
]

const CONVERSATION_TIPS = [
  {
    title: "Emailing your professor",
    ko: "교수님에게 이메일 쓰기",
    icon: "✉️",
    tips: [
      { en: "Use a clear subject line: [Course Code] - Your Question", ko: "제목은 반드시 [과목코드] - 질문 내용 포함" },
      { en: "Start with 'Dear Professor [Last Name]' or 'Hi Professor [Last Name]'", ko: "인사는 'Dear Professor [성]' 또는 'Hi Professor [성]'" },
      { en: "State your question clearly in the first sentence", ko: "첫 문장에 질문을 명확하게 적기" },
      { en: "End with 'Thank you for your time' or 'Best regards'", ko: "마무리는 'Thank you for your time' 또는 'Best regards'" },
      { en: "Proofread before sending", ko: "보내기 전에 반드시 교정하기" },
    ],
  },
  {
    title: "Participating in class",
    ko: "수업에서 발표하기",
    icon: "🗣️",
    tips: [
      { en: "I think... / In my opinion...", ko: "제 생각에는... / 제 의견으로는..." },
      { en: "Could you clarify what you mean by...?", ko: "...이라는 말이 무슨 뜻인지 설명해줄 수 있어요?" },
      { en: "I see your point, but...", ko: "그 말씀 이해하는데,..." },
      { en: "That's an interesting perspective. I'd like to add...", ko: "흥미로운 관점이네요. 저는 추가하자면..." },
      { en: "I'm not sure I agree. What about...?", ko: "동의하기 어렵네요. ...는 어떤가요?" },
    ],
  },
  {
    title: "Talking with flatmates",
    ko: "룸메이트와 대화",
    icon: "🏠",
    tips: [
      { en: "Do you mind if I...?", ko: "...해도 괜찮아?", context: "Being considerate" },
      { en: "Could we set some house rules?", ko: "집 규칙 정할 수 있을까?" },
      { en: "I'll be having guests over on...", ko: "...에 손님 올 거야", context: "Giving a heads up" },
      { en: "Could you keep it down a bit?", ko: "조금만 조용히 해줄래?", context: "Polite noise request" },
      { en: "Thanks for being so tidy!", ko: "깔끔하게 써줘서 고마워!", context: "Positive reinforcement" },
    ],
  },
  {
    title: "Academic writing",
    ko: "학술 글쓰기",
    icon: "📝",
    tips: [
      { en: "Avoid contractions (don't → do not)", ko: "약어 쓰지 않기 (don't → do not)" },
      { en: "Use 'Furthermore' or 'Moreover' to add points", ko: "'Furthermore' 또는 'Moreover'로 추가 근거 연결" },
      { en: "Use 'However' or 'Nevertheless' for contrast", ko: "'However' 또는 'Nevertheless'로 대비 표현" },
      { en: "Use 'In contrast' instead of 'But'", ko: "'But' 대신 'In contrast' 사용" },
      { en: "End with a clear conclusion", ko: "명확한 결론으로 마무리" },
    ],
  },
]

const VOCABULARY_LIST = [
  {
    category: "Australian slang",
    ko: "호주식 표현",
    items: [
      { word: "Arvo", meaning: "Afternoon", ko: "오후" },
      { word: "Barbie", meaning: "Barbecue", ko: "바베큐" },
      { word: "Brekkie", meaning: "Breakfast", ko: "아침식사" },
      { word: "Chook", meaning: "Chicken", ko: "닭" },
      { word: "Crikey", meaning: "Expression of surprise", ko: "깜짝이야" },
      { word: "Dunny", meaning: "Toilet", ko: "화장실" },
      { word: "G'day", meaning: "Hello", ko: "안녕" },
      { word: "Maccas", meaning: "McDonald's", ko: "맥도날드" },
      { word: "Servo", meaning: "Service station", ko: "주유소" },
      { word: "Sunnies", meaning: "Sunglasses", ko: "선글라스" },
      { word: "Thongs", meaning: "Flip-flops", ko: "슬리퍼" },
      { word: "Ute", meaning: "Utility vehicle (pickup)", ko: "픽업트럭" },
    ],
  },
  {
    category: "University terms",
    ko: "대학 용어",
    items: [
      { word: "Enrolment", meaning: "Registration for courses", ko: "수강 신청" },
      { word: "Tutorial", meaning: "Small group class", ko: "튜토리얼" },
      { word: "Lecture", meaning: "Large group class", ko: "강의" },
      { word: "Semester", meaning: "Half-year term", ko: "학기" },
      { word: "Trimester", meaning: "Third-year term", ko: "트리메스터" },
      { word: "Prerequisite", meaning: "Required course before", ko: "선수과목" },
      { word: "Elective", meaning: "Optional course", ko: "선택과목" },
      { word: "Major", meaning: "Main field of study", ko: "전공" },
      { word: "Minor", meaning: "Secondary field", ko: "부전공" },
      { word: "GPA", meaning: "Grade Point Average", ko: "평점" },
      { word: "Distinction", meaning: "High grade (70-79%)", ko: "우수" },
      { word: "Credit", meaning: "Good grade (60-69%)", ko: "양호" },
    ],
  },
  {
    category: "Housing",
    ko: "주거 관련",
    items: [
      { word: "Bond", meaning: "Security deposit", ko: "보증금" },
      { word: "Lease", meaning: "Rental agreement", ko: "임대 계약" },
      { word: "Flatmate", meaning: "Housemate", ko: "룸메이트" },
      { word: "Share house", meaning: "Shared accommodation", ko: "쉐어하우스" },
      { word: "Studio", meaning: "One-room apartment", ko: "원룸" },
      { word: "Unit", meaning: "Apartment", ko: "아파트" },
      { word: "Household bills", meaning: "Utilities (electricity, water, gas)", ko: "공과금" },
      { word: "Inspection", meaning: "Property viewing", ko: "집 보러 가기" },
    ],
  },
  {
    category: "Banking & money",
    ko: "금융 및 돈",
    items: [
      { word: "Account", meaning: "Bank account", ko: "통장" },
      { word: "ATM", meaning: "Automated Teller Machine", ko: "자동 입출금기" },
      { word: "BSB", meaning: "Bank State Branch (sort code)", ko: "은행 코드" },
      { word: "Direct debit", meaning: "Automatic payment", ko: "자동 이체" },
      { word: "HICAPS", meaning: "Health claim system", ko: "건강보험 청구" },
      { word: "Medicare", meaning: "Australian health insurance", ko: "메디케어" },
      { word: "TFN", meaning: "Tax File Number", ko: "세금 파일 번호" },
      { word: "Superannuation", meaning: "Retirement fund", ko: "퇴직 연금" },
    ],
  },
]

export function EnglishSpace({ isKo }: { isKo: boolean }) {
  const [activeTab, setActiveTab] = useState<"expressions" | "tips" | "vocabulary">("expressions")
  const [copiedIdx, setCopiedIdx] = useState<string | null>(null)
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  function handleCopy(text: string, key: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedIdx(key)
      setTimeout(() => setCopiedIdx(null), 2000)
    })
  }

  function toggleCategory(category: string) {
    setExpandedCategory(prev => prev === category ? null : category)
  }

  return (
    <section className="mx-auto max-w-5xl px-6 pt-7 sm:px-10 sm:pt-10">
      <p className="text-xs font-semibold uppercase tracking-[.14em] text-violet-600">
        {isKo ? "영어 학습" : "ENGLISH"}
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
        {isKo ? "영어를 실전에서 써보세요" : "Put your English into practice"}
      </h1>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {isKo
          ? "호주 생활과 학업에 바로 쓸 수 있는 표현, 회화 팁, 필수 어휘를 모아봤습니다."
          : "Everyday expressions, conversation tips and essential vocabulary for life and study in Australia."}
      </p>

      {/* Tabs */}
      <div className="mt-8 flex gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1">
        <button
          type="button"
          onClick={() => setActiveTab("expressions")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            activeTab === "expressions" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <MessageCircle className="size-4" />
          {isKo ? "일상 표현" : "Expressions"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tips")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            activeTab === "tips" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <Mic className="size-4" />
          {isKo ? "회화 팁" : "Tips"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("vocabulary")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition",
            activeTab === "vocabulary" ? "bg-white text-violet-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
          )}
        >
          <BookOpen className="size-4" />
          {isKo ? "필수 어휘" : "Vocabulary"}
        </button>
      </div>

      {/* Daily Expressions */}
      {activeTab === "expressions" && (
        <div className="mt-8 space-y-4">
          {DAILY_EXPRESSIONS.map((group) => (
            <div key={group.category} className="rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => toggleCategory(group.category)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-950">{group.category}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{group.ko}</p>
                </div>
                {expandedCategory === group.category ? (
                  <ChevronUp className="size-4 text-slate-400" />
                ) : (
                  <ChevronDown className="size-4 text-slate-400" />
                )}
              </button>
              {(expandedCategory === group.category || expandedCategory === null) && (
                <div className="border-t border-slate-100 px-5 py-3">
                  <div className="space-y-3">
                    {group.items.map((item, idx) => (
                      <div key={idx} className="flex items-start justify-between gap-3 rounded-xl bg-slate-50 px-4 py-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-950">{item.en}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{item.ko}</p>
                          <p className="mt-1 text-xs text-violet-600">{item.context}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(item.en, `expr-${group.category}-${idx}`)}
                          className="shrink-0 text-slate-400 transition hover:text-violet-600"
                          aria-label={isKo ? "복사" : "Copy"}
                        >
                          {copiedIdx === `expr-${group.category}-${idx}` ? (
                            <Check className="size-4 text-emerald-500" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Conversation Tips */}
      {activeTab === "tips" && (
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          {CONVERSATION_TIPS.map((section) => (
            <div key={section.title} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center gap-2">
                <span className="text-lg">{section.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-slate-950">{section.title}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{section.ko}</p>
                </div>
              </div>
              <ul className="mt-4 space-y-2">
                {section.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="mt-1 size-1.5 shrink-0 rounded-full bg-violet-400" />
                    <div>
                      <p className="font-medium text-slate-700">{tip.en}</p>
                      <p className="mt-0.5 text-xs text-slate-500">{tip.ko}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Vocabulary */}
      {activeTab === "vocabulary" && (
        <div className="mt-8 space-y-4">
          {VOCABULARY_LIST.map((group) => (
            <div key={group.category} className="rounded-2xl border border-slate-200 bg-white">
              <button
                type="button"
                onClick={() => toggleCategory(group.category)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-950">{group.category}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{group.ko}</p>
                </div>
                {expandedCategory === group.category ? (
                  <ChevronUp className="size-4 text-slate-400" />
                ) : (
                  <ChevronDown className="size-4 text-slate-400" />
                )}
              </button>
              {(expandedCategory === group.category || expandedCategory === null) && (
                <div className="border-t border-slate-100 px-5 py-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-[.1em] text-slate-500">
                          <th className="px-3 py-2">{isKo ? "단어" : "Word"}</th>
                          <th className="px-3 py-2">{isKo ? "의미" : "Meaning"}</th>
                          <th className="px-3 py-2">{isKo ? "한국어" : "Korean"}</th>
                          <th className="px-3 py-2" />
                        </tr>
                      </thead>
                      <tbody>
                        {group.items.map((item, idx) => (
                          <tr key={idx} className="border-b border-slate-100 last:border-0">
                            <td className="px-3 py-2.5 font-semibold text-slate-950">{item.word}</td>
                            <td className="px-3 py-2.5 text-slate-500">{item.meaning}</td>
                            <td className="px-3 py-2.5 text-slate-500">{item.ko}</td>
                            <td className="px-3 py-2.5">
                              <button
                                type="button"
                                onClick={() => handleCopy(item.word, `vocab-${group.category}-${idx}`)}
                                className="text-slate-400 transition hover:text-violet-600"
                                aria-label={isKo ? "복사" : "Copy"}
                              >
                                {copiedIdx === `vocab-${group.category}-${idx}` ? (
                                  <Check className="size-4 text-emerald-500" />
                                ) : (
                                  <Copy className="size-4" />
                                )}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
