document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const cellSize = 16;
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;

    const scaleCanvas = () => {
        const minSide = Math.min(window.innerWidth, window.innerHeight);
        canvas.style.width = `${minSide}px`;
        canvas.style.height = `${minSide}px`;
    };
    window.addEventListener('resize', scaleCanvas);
    scaleCanvas();

    const directions = {
        ArrowUp: {x: 0, y: -1},
        ArrowDown: {x: 0, y: 1},
        ArrowLeft: {x: -1, y: 0},
        ArrowRight: {x: 1, y: 0}
    };
    let snake = [{x: 10, y: 10}];
    let dir = directions.ArrowRight;
    let food = {x: 5, y: 5};
    let score = 0;
    const speed = 150;
    let gameInterval;
    const scoreEl = document.getElementById('score');
    const startBtn = document.getElementById('startBtn');
    const gameOverEl = document.getElementById('gameOver');
    const container = document.querySelector('.game-container');
    let isGameOver = false;

    const drawCell = (x, y, color) => {
        ctx.fillStyle = color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
    };

    const randomPos = () => ({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize)
    });

    const draw = () => {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        snake.forEach(seg => drawCell(seg.x, seg.y, '#0f0'));
        drawCell(food.x, food.y, '#f00');
    };

    const move = () => {
        const head = {x: snake[0].x + dir.x, y: snake[0].y + dir.y};
        if (head.x < 0) head.x = gridSize - 1;
        if (head.x >= gridSize) head.x = 0;
        if (head.y < 0) head.y = gridSize - 1;
        if (head.y >= gridSize) head.y = 0;

        if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
            stopGame();
            return;
        }
        snake.unshift(head);
        if (head.x === food.x && head.y === food.y) {
            score++;
            scoreEl.textContent = `Score: ${score}`;
            food = randomPos();
        } else {
            snake.pop();
        }
        draw();
    };

    const startGame = () => {
        snake = [{x: 10, y: 10}];
        dir = directions.ArrowRight;
        food = randomPos();
        score = 0;
        scoreEl.textContent = 'Score: 0';
        clearInterval(gameInterval);
        gameInterval = setInterval(move, speed);
        startBtn.classList.add('hidden');
        gameOverEl.classList.add('hidden');
        isGameOver = false;
    };

    const stopGame = () => {
        clearInterval(gameInterval);
        gameOverEl.textContent = `Game Over! Score: ${score}`;
        gameOverEl.classList.remove('hidden');
        isGameOver = true;
    };

    document.addEventListener('keydown', e => {
        if (directions[e.key]) {
            const newDir = directions[e.key];
            if (snake.length > 1) {
                const next = {x: snake[0].x + newDir.x, y: snake[0].y + newDir.y};
                if (next.x === snake[1].x && next.y === snake[1].y) return;
            }
            dir = newDir;
        }
    });

    const handleTouch = e => {
        const t = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
        if (!t) return;
        const rect = canvas.getBoundingClientRect();
        const relX = (t.clientX - rect.left) / rect.width;
        const relY = (t.clientY - rect.top) / rect.height;
        const head = snake[0];
        const headX = (head.x + 0.5) / gridSize;
        const headY = (head.y + 0.5) / gridSize;
        const dx = relX - headX;
        const dy = relY - headY;
        let newDir;
        if (Math.abs(dx) > Math.abs(dy)) {
            newDir = dx > 0 ? directions.ArrowRight : directions.ArrowLeft;
        } else {
            newDir = dy > 0 ? directions.ArrowDown : directions.ArrowUp;
        }
        if (snake.length > 1) {
            const next = {x: head.x + newDir.x, y: head.y + newDir.y};
            if (next.x === snake[1].x && next.y === snake[1].y) return;
        }
        dir = newDir;
    };

    canvas.addEventListener('touchstart', handleTouch);

    startBtn.addEventListener('click', e => {
        e.stopPropagation();
        startGame();
    });

    const showStart = () => {
        gameOverEl.classList.add('hidden');
        startBtn.classList.remove('hidden');
    };

    container.addEventListener('click', () => {
        if (isGameOver) showStart();
    });
    container.addEventListener('touchstart', () => {
        if (isGameOver) showStart();
    });

    draw();
});
