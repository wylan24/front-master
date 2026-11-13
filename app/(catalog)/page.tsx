import type { Metadata } from "next";
import { ArrayBoxes } from "@/components/academy/array-boxes";
import { RowLabel } from "@/components/academy/content";
import { COURSES } from "@/components/academy/course/courses";
import { CourseCard } from "@/components/catalog/course-card";

export const metadata: Metadata = {
  title: "Courses",
  description:
    "Interactive coding courses with short lessons, hands-on widgets, quizzes and code you run in your browser.",
};

// Every stage in every course follows these four steps, in this order.
const STAGE_STEPS = ["learn", "play", "check", "code"];

function describeCatalogue(): string {
  let stageTotal = 0;
  for (const course of COURSES) {
    stageTotal += course.stages.length;
  }

  const courseWord = COURSES.length === 1 ? "course" : "courses";
  return `${COURSES.length} ${courseWord}, ${stageTotal} stages in total`;
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-[1080px] px-[clamp(18px,4vw,56px)] pt-[clamp(32px,7vh,72px)] pb-20">
      <header className="max-w-[720px]">
        <h1 className="text-[length:clamp(34px,5.5vw,54px)] leading-[1.05] font-bold tracking-[-.035em]">
          Learn to code one small idea at a time.
        </h1>
        <p className="mt-5 max-w-[620px] text-[18px] text-body-ink">
          Each course pairs short lessons with hands-on widgets, quizzes and
          code you run right in your browser. Your progress saves on this
          device, so you can stop and pick up where you left off.
        </p>

        <figure className="mt-7">
          <RowLabel>const stage =</RowLabel>
          <ArrayBoxes values={STAGE_STEPS} />
          <figcaption className="max-w-[560px] text-[14px] text-muted-foreground">
            Every stage runs in the same order: read the idea, play with it,
            check yourself with a quiz, then write the code.
          </figcaption>
        </figure>
      </header>

      <section aria-labelledby="courses-heading" className="mt-14">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-border pb-3">
          <h2 id="courses-heading" className="text-[21px] font-bold tracking-[-.02em]">
            Courses
          </h2>
          <p className="text-[14px] text-muted-foreground">{describeCatalogue()}</p>
        </div>

        <ul className="mt-6 grid gap-5 md:grid-cols-2">
          {COURSES.map((course) => (
            <li key={course.slug}>
              <CourseCard course={course} />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
