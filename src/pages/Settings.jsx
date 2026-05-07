import { Bell, LockKeyhole, ShieldCheck, UserRound } from 'lucide-react'
import { useState } from 'react'
import { PageHeader } from '../components/BoostFundrUI'

const Settings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [maintenanceAlerts, setMaintenanceAlerts] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)

  return (
    <div className="space-y-8 pb-10">
      <PageHeader
        eyebrow="Settings"
        title="Admin Settings"
        description="Only the core admin controls needed to manage access, notifications, and account identity."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#01F27B]/10 text-[#01F27B]">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Profile</h2>
              <p className="text-sm text-white/55">Name, email, and role information for the active admin account.</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Full name</span>
              <input
                type="text"
                defaultValue="Lena Foster"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#01F27B]/40"
              />
            </label>

            <label className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Email address</span>
              <input
                type="email"
                defaultValue="admin@boostfunder.com"
                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none transition focus:border-[#01F27B]/40"
              />
            </label>

            <label className="space-y-2 sm:col-span-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Role</span>
              <input
                type="text"
                defaultValue="Administrator"
                disabled
                className="w-full cursor-not-allowed rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/70 outline-none"
              />
            </label>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <p className="text-sm text-white/55">Keep only the alert types an admin actually needs.</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              {
                title: 'Email alerts',
                description: 'Receive important platform updates by email.',
                enabled: emailAlerts,
                setEnabled: setEmailAlerts,
              },
              {
                title: 'Login alerts',
                description: 'Notify when an admin account signs in from a new device.',
                enabled: loginAlerts,
                setEnabled: setLoginAlerts,
              },
              {
                title: 'Maintenance alerts',
                description: 'Get notified before system maintenance windows.',
                enabled: maintenanceAlerts,
                setEnabled: setMaintenanceAlerts,
              },
            ].map((item) => (
              <button
                key={item.title}
                type="button"
                onClick={() => item.setEnabled((prev) => !prev)}
                className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-left transition hover:border-white/20"
              >
                <div>
                  <div className="text-sm font-semibold text-white">{item.title}</div>
                  <div className="text-sm text-white/50">{item.description}</div>
                </div>
                <div
                  className={`relative h-6 w-11 rounded-full transition ${
                    item.enabled ? 'bg-[#01F27B]' : 'bg-white/15'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
                      item.enabled ? 'left-5' : 'left-0.5'
                    }`}
                  />
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl xl:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-white/55">Only the essential access control option is exposed here.</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-white">Two-factor authentication</p>
              <p className="text-sm text-white/50">Add an extra sign-in check for admin access.</p>
            </div>

            <button
              type="button"
              onClick={() => setTwoFactorAuth((prev) => !prev)}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                twoFactorAuth
                  ? 'bg-[#01F27B] text-black'
                  : 'border border-white/10 bg-white/5 text-white hover:border-white/20'
              }`}
            >
              <LockKeyhole className="h-4 w-4" />
              {twoFactorAuth ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Settings
