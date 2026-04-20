"use client";

import { Mail, ShieldCheck } from "lucide-react";

export default function ContactPage() {
    return (
        <section className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-16">
            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-3xl p-8 sm:p-10 backdrop-blur-md">

                {/* Heading */}
                <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4">
                    Contact Us
                </h1>

                <p className="text-center text-pink-200/80 mb-10">
                    Have questions or need assistance? We're here to help.
                </p>

                {/* Contact Card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">

                    <Mail className="w-8 h-8 text-[#FF2D95] mx-auto mb-3" />

                    <p className="text-lg font-semibold mb-2">
                        tubiqlabs@gmail.com
                    </p>

                    <p className="text-sm text-pink-100/70">
                        We usually respond within 24 hours
                    </p>
                </div>

                {/* Info */}
                <div className="mt-8 text-center text-sm text-pink-100/80 leading-relaxed space-y-3">
                    <p>
                        This platform provides automated conversation services for
                        entertainment purposes only.
                    </p>

                    <p>
                        All profiles are virtual chat assistants. No real human interaction
                        is involved.
                    </p>

                    <p>
                        This service does not offer dating, personal relationships, or
                        offline meetings.
                    </p>

                    <p className="flex items-center justify-center gap-2 text-pink-300">
                        <ShieldCheck className="w-4 h-4" />
                        Use responsibly • 18+ only
                    </p>
                </div>

            </div>
        </section>
    );
}