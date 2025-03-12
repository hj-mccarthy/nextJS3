import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Clock, Coffee, Heart, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16 lg:py-24">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About Us</h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {" "}
            text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed"> Learn about our mission,
            values, and the team behind ModernApp.
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Founded in 2023, ModernApp was born out of a passion for creating better web experiences. We noticed that
            many developers struggled with building modern, accessible, and responsive web applications efficiently.
          </p>
          <p className="text-muted-foreground mb-4">
            Our team of experienced developers and designers came together with a shared vision: to create a platform
            that makes it easy for developers to build beautiful, high-performance web applications without sacrificing
            quality or accessibility.
          </p>
          <p className="text-muted-foreground">
            Today, we're proud to offer a comprehensive solution that leverages the latest technologies like Next.js 15,
            Shadcn UI, and Tailwind CSS v4 to help developers build the next generation of web applications.
          </p>
        </div>
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 blur-xl"></div>
          <div className="relative bg-card border rounded-lg shadow-lg p-8 h-full">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Users className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">10k+</span>
                <span className="text-sm text-muted-foreground">Users</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Coffee className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">15k+</span>
                <span className="text-sm text-muted-foreground">Projects</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Clock className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">5k+</span>
                <span className="text-sm text-muted-foreground">Hours Saved</span>
              </div>
              <div className="flex flex-col items-center justify-center p-4 bg-muted rounded-lg">
                <Heart className="h-8 w-8 text-primary mb-2" />
                <span className="text-2xl font-bold">99%</span>
                <span className="text-sm text-muted-foreground">Satisfaction</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Values Section */}
      <div className="mb-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Our Values</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            These core values guide everything we do, from product development to customer support.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="h-full">
              <CardHeader className="pb-2">
                <div className="p-2 w-fit rounded-lg bg-muted">{value.icon}</div>
                <CardTitle className="mt-2">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{value.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Our Team Section */}
      <div>
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Meet the talented individuals who make ModernApp possible.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {team.map((member, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-2">
                  <span className="font-semibold text-xl">{member.name.charAt(0)}</span>
                </div>
                <CardTitle className="text-center">{member.name}</CardTitle>
                <CardDescription className="text-center">{member.role}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

const values = [
  {
    title: "Innovation",
    description:
      "We're constantly pushing the boundaries of what's possible in web development, embracing new technologies and approaches.",
    icon: <Award className="h-5 w-5" />,
  },
  {
    title: "Quality",
    description:
      "We believe in doing things right the first time, with a focus on code quality, performance, and user experience.",
    icon: <Award className="h-5 w-5" />,
  },
  {
    title: "Accessibility",
    description:
      "We're committed to building inclusive web applications that everyone can use, regardless of their abilities.",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Community",
    description:
      "We believe in the power of community and open source, sharing our knowledge and learning from others.",
    icon: <Heart className="h-5 w-5" />,
  },
]

const team = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "Alex has over 15 years of experience in web development and has been working with React and Next.js since their early days.",
  },
  {
    name: "Samantha Lee",
    role: "CTO",
    bio: "Samantha is a full-stack developer with a passion for building accessible and performant web applications.",
  },
  {
    name: "David Chen",
    role: "Lead Designer",
    bio: "David brings 10 years of UI/UX design experience, with a focus on creating beautiful and intuitive user interfaces.",
  },
  {
    name: "Maria Rodriguez",
    role: "Head of Product",
    bio: "Maria has a background in product management and user research, ensuring our products meet real user needs.",
  },
  {
    name: "James Wilson",
    role: "Lead Developer",
    bio: "James specializes in frontend development and has contributed to several open-source projects in the React ecosystem.",
  },
  {
    name: "Priya Patel",
    role: "Developer Advocate",
    bio: "Priya loves teaching and sharing knowledge about web development through tutorials, articles, and conference talks.",
  },
]

