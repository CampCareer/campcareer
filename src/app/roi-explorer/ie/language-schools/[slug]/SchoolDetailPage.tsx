"use client"

import Link from "next/link"
import { ArrowRight, ExternalLink, Globe, MapPin, Star, Users, Home, GraduationCap, Clock, Award, BookOpen } from "lucide-react"

import { TopNav } from "@/components/layout/top-nav"
import { SiteFooter } from "@/components/layout/site-footer"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SchoolWithCourses } from "@/lib/language-schools-ie"

const COURSE_TYPE_LABEL: Record<string, string> = {
  general_english: "일반 영어",
  ielts_prep: "IELTS 준비",
  cambridge_prep: "캠브리지 (FCE/CAE)",
  academic_english: "아카데믹 영어",
  business_english: "비즈니스 영어",
  junior: "주니어",
  teacher_training: "교사 연수",
}

export default function SchoolDetailPage({ school }: { school: SchoolWithCourses }) {
  return (
    <div className="flex min-h-screen flex-col">
      <TopNav />

      <main className="flex-1 bg-background">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
          <Link
            href="/roi-explorer/ie/language-schools"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowRight className="size-3.5 rotate-180" />
            어학원 목록
          </Link>

          <header className="mt-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="gap-1">
                <Globe className="size-3" />
                Ireland
              </Badge>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {school.name_en}
            </h1>
            {school.name_ko && (
              <p className="text-base text-muted-foreground">{school.name_ko}</p>
            )}

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3.5" />
                {school.city}{school.region ? `, ${school.region}` : ""}
              </span>
              {school.google_rating && (
                <span className="inline-flex items-center gap-1">
                  <Star className="size-3.5 fill-amber-400 text-amber-400" />
                  {school.google_rating}/5
                </span>
              )}
              {school.established_year && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="size-3.5" />
                  설립 {school.established_year}년
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {school.accreditation?.map((a) => (
                <Badge key={a} variant="secondary">{a}</Badge>
              ))}
            </div>
          </header>

          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              {school.description_ko && (
                <Card>
                  <CardContent className="pt-5">
                    <p className="text-sm text-slate-700 leading-relaxed">{school.description_ko}</p>
                  </CardContent>
                </Card>
              )}

              {/* Courses */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <BookOpen className="size-4" />
                    개설 과정
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {school.courses.length === 0 ? (
                    <p className="text-sm text-muted-foreground">등록된 과정이 없습니다.</p>
                  ) : (
                    school.courses.map((c) => (
                      <div key={c.id} className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-medium text-slate-800">{c.name_en}</p>
                            {c.name_ko && <p className="text-xs text-muted-foreground">{c.name_ko}</p>}
                          </div>
                          <Badge>{COURSE_TYPE_LABEL[c.course_type] ?? c.course_type}</Badge>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                          {c.lessons_per_week && <span>주 {c.lessons_per_week}레슨</span>}
                          {c.max_class_size && <span>최대 {c.max_class_size}명</span>}
                          {c.duration_min && c.duration_max && (
                            <span>{c.duration_min}–{c.duration_max}주</span>
                          )}
                          {c.price_per_week && <span className="font-semibold text-slate-700">€{c.price_per_week}/주</span>}
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Quick facts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">기본 정보</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {school.average_nationalities && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="size-4 shrink-0" />
                      <span>{school.average_nationalities}개국 국적</span>
                    </div>
                  )}
                  {school.student_capacity && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <GraduationCap className="size-4 shrink-0" />
                      <span>최대 {school.student_capacity}명 수용</span>
                    </div>
                  )}
                  {school.min_age && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Award className="size-4 shrink-0" />
                      <span>최소 연령: 만 {school.min_age}세</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Accommodation */}
              {school.accommodation_types && school.accommodation_types.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Home className="size-4" />
                      숙소 옵션
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {school.accommodation_types.map((t) => (
                      <div key={t} className="flex items-center gap-2 text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-slate-400" />
                        <span>{t === "homestay" ? "홈스테이" : t === "residence" ? "기숙사" : t === "apartment" ? "아파트" : t}</span>
                      </div>
                    ))}
                    {school.homestay_price_week && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        홈스테이: €{school.homestay_price_week}/주
                        {school.residence_price_week && ` · 기숙사: €${school.residence_price_week}/주`}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Website */}
              {school.website_url && (
                <a
                  href={school.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  <ExternalLink className="size-4" />
                  공식 웹사이트
                </a>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
