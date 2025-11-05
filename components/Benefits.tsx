"use client";
import data from "@/data/site.json";
import { motion } from "framer-motion";
import { FiShield, FiCheckCircle, FiThumbsUp, FiTrendingUp, FiClock, FiUsers } from "react-icons/fi";

export default function Benefits() {
  return (
    <section id="benefits" className="section bg-white dark:bg-slate-900">
      <div className="container">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">Why choose OOJED?</h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2">Transparent, quality-first manufacturing & services.</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {data.values.map((v, i) => {
            const ICONS = [FiShield, FiCheckCircle, FiThumbsUp, FiTrendingUp, FiClock, FiUsers];
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: .45, delay: i * .04 }}
                className="card p-6 dark:bg-slate-800 dark:border-slate-700">
                <div className="flex items-start gap-3">
                  <div className="mt-1 hover-raise text-blue-700 dark:text-[#9cc0ff]">
                    <Icon size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-slate-900 dark:text-white">{v}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
