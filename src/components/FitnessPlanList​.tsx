import React, { useEffect, useState } from 'react';
import { getFitnessPlans } from '../api';
import { FitnessPlan } from '../types';

// Component Name: FitnessPlanList
const FitnessPlanList: React.FC = () => {
    const [plans, setPlans] = useState<FitnessPlan[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                setLoading(true);
                const data = await getFitnessPlans();
                setPlans(data);
            } catch (err) {
                console.error('Error fetching fitness plans:', err);
                setError('Failed to load fitness plans.');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return <div className="text-center mt-8 text-gray-600">Loading fitness plans...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Fitness Plans</h2>
            {plans.length === 0 ? (
                <p className="text-center text-gray-600">No fitness plans available.</p>
            ) : (
                <ul className="flex flex-wrap justify-center gap-2">
                    {plans.map(plan => (
                        <li key={plan.id} className="w-full md:w-1/2 lg:w-1/3 p-6 flex flex-col items-center bg-white rounded-lg shadow-md border border-gray-200">
                            <h3 className="text-xl font-semibold mb-2 text-blue-600">{plan.title}</h3>
                            <p className="text-gray-700 mb-3">{plan.description}</p>
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {plan.type.toUpperCase()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FitnessPlanList;