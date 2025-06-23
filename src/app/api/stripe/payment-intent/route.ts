import { NextRequest, NextResponse } from 'next/server'

// Temporarily disable Stripe for build
export async function POST(request: NextRequest) {
    try {
        await request.json() // Parse request but don't use the data

        // Return mock response for build/testing
        return NextResponse.json({
            clientSecret: 'pi_test_fake_client_secret_for_testing',
            message: 'This is a mock response. Real Stripe integration is disabled.'
        })

    } catch (error: any) {
        console.error('Mock API error:', error)
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}
