// MOCK API Implementation (Client-Side Only)
// This replaces the backend connection with LocalStorage persistence
// to solve deployment issues.

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock Database Helper
const mockDb = {
    getUsers: () => JSON.parse(localStorage.getItem('mock_db_users') || '[]'),
    saveUser: (user: any) => {
        const users = mockDb.getUsers();
        users.push(user);
        localStorage.setItem('mock_db_users', JSON.stringify(users));
    },
    findUserByEmail: (email: string) => {
        const users = mockDb.getUsers();
        return users.find((u: any) => u.email === email);
    },
    getReconciliations: () => JSON.parse(localStorage.getItem('mock_db_reconciliations') || '[]'),
    saveReconciliation: (rec: any) => {
        const recs = mockDb.getReconciliations();
        recs.push(rec);
        localStorage.setItem('mock_db_reconciliations', JSON.stringify(recs));
    },
    deleteReconciliation: (id: string) => {
        const recs = mockDb.getReconciliations();
        const filtered = recs.filter((r: any) => r._id !== id);
        localStorage.setItem('mock_db_reconciliations', JSON.stringify(filtered));
    }
};

export const API_URL = "Client-Side Storage (No Backend)";

// Auth API
export const authAPI = {
    signup: async (name: string, email: string, password: string) => {
        await delay(500);

        const existingUser = mockDb.findUserByEmail(email);
        if (existingUser) {
            // Return error structure matching axios error
            throw { response: { data: { message: "User with this email already exists" } } };
        }

        const newUser = {
            id: crypto.randomUUID(),
            name,
            email,
            password
        };
        mockDb.saveUser(newUser);

        // Return success structure
        return {
            success: true,
            data: {
                user: { id: newUser.id, name: newUser.name, email: newUser.email },
                token: "mock-jwt-token-" + Date.now()
            }
        };
    },

    login: async (email: string, password: string) => {
        await delay(500);

        const user = mockDb.findUserByEmail(email);
        if (!user || user.password !== password) {
            throw { response: { data: { message: "Invalid email or password" } } };
        }

        return {
            success: true,
            data: {
                user: { id: user.id, name: user.name, email: user.email },
                token: "mock-jwt-token-" + Date.now()
            }
        };
    },

    getMe: async () => {
        // Just return stored user from local storage logic in AuthContext usually handles this,
        // but for consistency we return success
        return { success: true, data: { user: { name: "Test User" } } };
    },
};

// Reconciliation API
export const reconciliationAPI = {
    save: async (reconciliationData: any) => {
        await delay(500);

        const newRec = {
            ...reconciliationData,
            _id: crypto.randomUUID(),
            createdAt: new Date().toISOString()
        };
        mockDb.saveReconciliation(newRec);

        return { success: true, data: newRec };
    },

    getAll: async (page: number = 1, limit: number = 10) => {
        await delay(300);
        const allRecs = mockDb.getReconciliations();
        // Sort by date desc
        allRecs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return {
            success: true,
            data: {
                reconciliations: allRecs, // Return all for simplicity or slice if needed
                pagination: { total: allRecs.length, pages: 1 }
            }
        };
    },

    getById: async (id: string) => {
        await delay(200);
        const recs = mockDb.getReconciliations();
        const found = recs.find((r: any) => r._id === id);
        if (!found) throw { message: "Not found" };
        return { success: true, data: found };
    },

    delete: async (id: string) => {
        await delay(300);
        mockDb.deleteReconciliation(id);
        return { success: true };
    },
};

export default {};
