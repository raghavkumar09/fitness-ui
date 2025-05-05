import React, { useEffect, useState } from 'react';
import { FitnessPlan, User } from '../types';
import { getAllUsersWithUserRole, getFitnessPlans, assignPlanToUser } from '../api';

// Component Name: AssignPlanForm
const AssignPlanForm: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [plans, setPlans] = useState<FitnessPlan[]>([]);
    const [selectedUser, setSelectedUser] = useState<string>('');
    const [selectedPlan, setSelectedPlan] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Fetch users and plans on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersData, plansData] = await Promise.all([
                    getAllUsersWithUserRole(),
                    getFitnessPlans(),
                ]);
                setUsers(usersData);
                setPlans(plansData);
            } catch (err) {
                console.error('Error fetching data for assignment form:', err);
                setError('Failed to load users or plans.');
            }
        };
        fetchData();
    }, []); // Run only once on mount

    // Function Name: submitAssignPlan
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);
        setLoading(true);

        if (!selectedUser || !selectedPlan) {
            setError('Please select both a user and a fitness plan.');
            setLoading(false);
            return;
        }

        const userId = parseInt(selectedUser, 10);
        const planId = parseInt(selectedPlan, 10);

        if (isNaN(userId) || isNaN(planId)) {
            setError('Invalid selection.');
            setLoading(false);
            return;
        }

        try {
            const result = await assignPlanToUser(userId, planId);
            setMessage(result.message);
            setSelectedUser('');
            setSelectedPlan('');
        } catch (err) {
            console.error('Assignment failed:', err);
            setError('Failed to assign plan.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Assign Fitness Plan</h2>

            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}


            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="user-select">
                        Select User:
                    </label>
                    <select
                        id="user-select"
                        value={selectedUser}
                        onChange={(e) => setSelectedUser(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={loading || users.length === 0}
                    >
                        <option value="">-- Select a User --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.username} ({user.role})
                            </option>
                        ))}
                    </select>
                    {users.length === 0 && !error && <p className="text-sm text-gray-500 mt-1">Loading users...</p>}
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="plan-select">
                        Select Fitness Plan:
                    </label>
                    <select
                        id="plan-select"
                        value={selectedPlan}
                        onChange={(e) => setSelectedPlan(e.target.value)}
                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        disabled={loading || plans.length === 0}
                    >
                        <option value="">-- Select a Plan --</option>
                        {plans.map(plan => (
                            <option key={plan.id} value={plan.id}>
                                {plan.title} ({plan.type})
                            </option>
                        ))}
                    </select>
                    {plans.length === 0 && !error && <p className="text-sm text-gray-500 mt-1">Loading plans...</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                        disabled={loading || !selectedUser || !selectedPlan}
                    >
                        {loading ? 'Assigning...' : 'Assign Plan'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AssignPlanForm;