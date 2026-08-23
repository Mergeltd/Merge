"use client";

import { Building2 } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';
import { StaggerGroup, StaggerItem } from '@/components/motion/stagger';
import { useAuth } from '@/providers/auth-provider';
import { useLandlordContext, useMyProperties } from '@/hooks/use-landlord-context';

export default function LandlordPropertiesPage() {
  const { session } = useAuth();
  const { data: landlordCtx } = useLandlordContext(session?.user.id);
  const { data: properties = [], isLoading } = useMyProperties(landlordCtx?.landlordId);

  const totalUnits = properties.reduce((sum, p) => sum + p.units, 0);
  const occupiedUnits = properties.reduce((sum, p) => sum + p.occupied, 0);

  return (
    <div className="space-y-6 pb-12">
      <Reveal>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Properties</h1>
          <p className="mt-1 text-sm text-slate-500">
            {properties.length} properties · {occupiedUnits}/{totalUnits} units occupied
          </p>
        </div>
      </Reveal>

      {properties.length > 0 ? (
        <StaggerGroup className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {properties.map((property) => (
            <StaggerItem key={property.id}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{property.name}</h3>
                    <p className="text-xs text-slate-500">{property.neighborhood}</p>
                  </div>
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
                    style={{ width: `${property.units > 0 ? Math.round((property.occupied / property.units) * 100) : 0}%` }}
                  />
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerGroup>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm py-16 text-center">
          <Building2 className="w-8 h-8 text-slate-300 mx-auto" />
          <p className="mt-3 text-sm text-slate-500">{isLoading ? 'Loading…' : 'No properties assigned to your account yet.'}</p>
        </div>
      )}
    </div>
  );
}
