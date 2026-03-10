import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Eye, Target, Heart, Users, Lightbulb, Award,
  ArrowRight, Linkedin, Github, Twitter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/contexts/ThemeContext';
import { getActiveTeamMembers } from '@/services/index';
import type { TeamMember } from '@/types';

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly push boundaries and explore new technologies to deliver cutting-edge solutions.',
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'We love what we do, and that passion translates into exceptional work for our clients.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We maintain the highest standards in every project, ensuring quality and attention to detail.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We work closely with our clients, believing that the best results come from teamwork.',
  },
];

// ─── Member card component ────────────────────────────────────────────────────
function MemberCard({ member, index }: { member: TeamMember; index: number }) {
  const hasSocials = member.linkedinUrl || member.githubUrl || member.twitterUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      className="group text-center"
    >
      {/* Avatar */}
      <div className="relative mb-4 mx-auto w-40 h-40">
        <div className="w-full h-full rounded-full overflow-hidden border-4 border-border group-hover:border-primary/50 transition-all duration-300">
          {member.image ? (
            <motion.img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary to-blue-500 flex items-center justify-center text-white text-4xl font-bold">
              {member.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Social links overlay */}
        {hasSocials && (
          <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {member.linkedinUrl && (
              <a
                href={member.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {member.githubUrl && (
              <a
                href={member.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-gray-700 flex items-center justify-center text-white transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {member.twitterUrl && (
              <a
                href={member.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                className="w-8 h-8 rounded-full bg-white/20 hover:bg-sky-500 flex items-center justify-center text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold mb-1 group-hover:text-primary transition-colors">
        {member.name}
      </h3>
      <p className="text-muted-foreground text-sm">{member.role}</p>
      {member.bio && (
        <p className="text-muted-foreground text-xs mt-2 max-w-[180px] mx-auto line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {member.bio}
        </p>
      )}
    </motion.div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────
function MemberSkeleton() {
  return (
    <div className="text-center animate-pulse">
      <div className="w-40 h-40 rounded-full bg-muted mx-auto mb-4" />
      <div className="h-4 bg-muted rounded w-32 mx-auto mb-2" />
      <div className="h-3 bg-muted rounded w-20 mx-auto" />
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function About() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isDark } = useTheme();

  const [team, setTeam]           = useState<TeamMember[]>([]);
  const [teamLoading, setTeamLoading] = useState(true);

  useEffect(() => {
    getActiveTeamMembers()
      .then(setTeam)
      .catch(console.error)
      .finally(() => setTeamLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-0">
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10"
        >
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          >
            <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              {t('aboutTitle')}
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            {t('aboutSubtitle')}
          </motion.p>
        </motion.div>
      </section>

      {/* ── Welcome ───────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col lg:flex-row items-center gap-12"
          >
            <motion.div whileHover={{ scale: 1.05, rotate: 5 }} className="flex-shrink-0">
              <div className={`w-48 h-48 md:w-64 md:h-64 rounded-3xl ${isDark ? 'bg-primary' : 'bg-primary/10'} flex items-center justify-center shadow-2xl`}>
                <svg
                  className={`w-24 h-24 md:w-32 md:h-32 ${isDark ? 'text-primary-foreground' : 'text-primary'}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                </svg>
              </div>
            </motion.div>

            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold mb-6"
              >
                {t('welcomeTitle')}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {t('welcomeText')}
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Mission / Vision / Values ─────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Target, key: 'mission', textKey: 'missionText', delay: 0.1 },
              { icon: Eye,    key: 'vision',  textKey: 'visionText',  delay: 0.2 },
              { icon: Heart,  key: 'values',  textKey: 'valuesText',  delay: 0.3 },
            ].map(({ icon: Icon, key, textKey, delay }) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay }}
                whileHover={{ y: -10 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{t(key)}</h3>
                <p className="text-muted-foreground">{t(textKey)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ──────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-primary">Core Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <value.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team Section ──────────────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-b from-muted/30 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our <span className="text-primary">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The talented people behind Digital Emporium
            </p>
          </motion.div>

          {/* Loading skeletons */}
          {teamLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => <MemberSkeleton key={i} />)}
            </div>
          )}

          {/* Team grid */}
          {!teamLoading && team.length > 0 && (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
              team.length <= 4
                ? 'lg:grid-cols-' + Math.min(team.length, 4)
                : 'lg:grid-cols-4'
            }`}>
              {team.map((member, index) => (
                <MemberCard key={member.id} member={member} index={index} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!teamLoading && team.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-muted-foreground"
            >
              <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>The equipment will be available soon.</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/10 to-blue-600/10 border border-primary/20 p-8 md:p-12"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl md:text-3xl font-bold mb-2">
                  Let's work together
                </h3>
                <p className="text-muted-foreground">Ready to bring your vision to life?</p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="lg"
                  onClick={() => navigate('/quote')}
                  className="bg-primary hover:bg-primary/90"
                >
                  {t('requestQuote')}
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}