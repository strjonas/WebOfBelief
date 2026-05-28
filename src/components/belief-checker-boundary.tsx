"use client";

import type { ErrorInfo, ReactNode } from "react";
import Link from "next/link";
import { Component } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class BeliefCheckerBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    void error;
    void errorInfo;
  }

  private reset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <section
        id="check"
        className="scroll-mt-24 border-t border-rule py-12 sm:py-16"
      >
        <div className="border-l-[3px] border-mark bg-paper-soft px-5 py-5">
          <p className="font-sans text-[0.72rem] uppercase tracking-[0.22em] text-mark">
            <span className="section-mark" />
            checker unavailable
          </p>
          <h2 className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight text-ink sm:text-3xl">
            The checker hit an unexpected client-side error.
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-[1rem] leading-7 text-ink-soft">
            Reload the check and try again. If it keeps failing, the method and
            source notes are still available.
          </p>
          <div className="mt-5 flex flex-wrap items-baseline gap-5 font-sans text-[0.78rem] uppercase tracking-[0.18em]">
            <button
              type="button"
              onClick={this.reset}
              className="border border-ink bg-ink px-5 py-2.5 text-paper transition hover:border-mark hover:bg-mark"
            >
              Retry the check
            </button>
            <Link
              href="/method"
              className="text-muted underline decoration-rule underline-offset-[5px] transition hover:text-ink hover:decoration-ink"
            >
              Read method &amp; sources
            </Link>
          </div>
        </div>
      </section>
    );
  }
}
