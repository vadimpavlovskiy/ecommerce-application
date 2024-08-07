<?php
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\StartSession;
use App\Http\Middleware\EnsureUserIsSubscribed;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Http\Middleware\HandleCors;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {

        $middleware->validateCsrfTokens(except: [
            'api/*'
        ]);
        $middleware->appendToGroup('web', [StartSession::class, EncryptCookies::class]);
        $middleware->prependToGroup('api',[StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        HandleCors::class,
        EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
        \Illuminate\Session\Middleware\AuthenticateSession::class,
        \Illuminate\Routing\Middleware\SubstituteBindings::class,]);

        // 'throttle:api',
        // 'bindings'
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
