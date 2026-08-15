import { Building2, UserCog, Home } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { ownedProperties } from '@/lib/mock/landlord';

export default function LandlordPropertiesPage() {
  const totalUnits = ownedProperties.reduce((sum, p) => sum + p.units, 0);
  const occupiedUnits = ownedProperties.reduce((sum, p) => sum + p.occupied, 0);

  return (
    <div className="space-y-6 pb-12">
      <Reveal>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-sm text-slate-500">
            {ownedProperties.length} properties · {occupiedUnits}/{totalUnits} units occupied
          </p>
        </div>
      </Reveal>

      <StaggerGroup className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {ownedProperties.map((property) => (
          <StaggerItem key={property.id}>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    {property.type === 'MANAGED_COMPLEX' ? (
                      <Building2 className="w-5 h-5 text-indigo-600" />
                    ) : (
                      <Home className="w-5 h-5 text-indigo-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{property.name}</h3>
                    <p className="text-xs text-slate-500">{property.neighborhood}</p>
                  </div>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 shrink-0">
                  {property.type === 'MANAGED_COMPLEX' ? 'Managed Complex' : 'Standalone Unit'}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-400">Occupancy</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">
                    {property.occupied}/{property.units}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-400">Monthly Rent</p>
                  <p className="mt-0.5 text-lg font-bold text-slate-900">KES {property.monthlyRent.toLocaleString()}</p>
                </div>
              </div>

              <div className="mt-4 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{ width: `${Math.round((property.occupied / property.units) * 100)}%` }}
                />
              </div>

              {property.managedBy && (
                <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
                  <UserCog className="w-3.5 h-3.5" />
                  Managed by {property.managedBy}
                </p>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
