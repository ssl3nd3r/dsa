<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\JsonResponse;

class OpenAIService
{
    protected string $baseUrl;
    protected string $apiKey;
    protected string $assistantId;

    public function __construct()
    {
        $this->baseUrl     = config('services.openai.base_url', 'https://api.openai.com/v1');
        $this->apiKey      = config('services.openai.api_key');
        $this->assistantId = config('services.openai.assistant_id');
    }

    public function sendMessage(string $userMessage, ?string $threadId = null): array | JsonResponse
    {
        try {
            // 1. Create thread if needed
        if ( ! $threadId) {
            $threadResp = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'OpenAI-Beta'   => 'assistants=v2',
            ])->post("{$this->baseUrl}/threads");
            $threadData = $threadResp->json();
            $threadId   = $threadData['id'];
        }


        // 2. Add user message
        $msgResp = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'OpenAI-Beta'   => 'assistants=v2',
        ])->post("{$this->baseUrl}/threads/{$threadId}/messages", [
            'role'    => 'user',
            'content' => $userMessage,
        ]);

        // 3. Run assistant
        $runResp = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'OpenAI-Beta'   => 'assistants=v2',
        ])->post("{$this->baseUrl}/threads/{$threadId}/runs", [
            'assistant_id' => $this->assistantId,
        ]);

        $runData = $runResp->json();
        $runId   = $runData['id'];

        // 4. Poll until completed (simplified; consider exponential backoff)
        do {
            sleep(1);
            $statusResp = Http::withHeaders([
                'Authorization' => "Bearer {$this->apiKey}",
                'OpenAI-Beta'   => 'assistants=v2',
            ])->get("{$this->baseUrl}/threads/{$threadId}/runs/{$runId}");
            $statusData = $statusResp->json();
        } while ($statusData['status'] !== 'completed');

        // 5. Fetch assistant messages
        $finalResp = Http::withHeaders([
            'Authorization' => "Bearer {$this->apiKey}",
            'OpenAI-Beta'   => 'assistants=v2',
        ])->get("{$this->baseUrl}/threads/{$threadId}/messages");

        return [
            'thread_id'   => $threadId,
            'assistant_reply' => $finalResp->json()['data'][0]['content'][0]['text']['value'],
        ];  
        } catch (\Throwable $th) {
            Log::error('OpenAI Service error: ' . $th->getMessage());
            return response()->json(['message' => 'Whoops, that didn\'t come out right — please try again!'], 500);
        }
        
    }
}
