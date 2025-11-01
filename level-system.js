class LevelSystem {
    constructor() {
        this.levels = {
            1: { points: 0, title: "Eco-Beginner", badge: "🌱", rewards: [] },
            2: { points: 100, title: "Eco-Enthusiast", badge: "♻️", rewards: ["5% discount at partners"] },
            3: { points: 300, title: "Green Warrior", badge: "🌍", rewards: ["10% discount", "Early access to events"] },
            4: { points: 600, title: "Eco-Champion", badge: "🏆", rewards: ["15% discount", "Special badge", "Featured on community page"] },
            5: { points: 1000, title: "Planet Guardian", badge: "🛡️", rewards: ["20% discount", "All previous rewards", "Community leader status"] }
        };

        this.achievements = {
            first_report: { name: "First Report", description: "Submit your first environmental issue", points: 25, icon: "📝" },
            cleanup_hero: { name: "Cleanup Hero", description: "Participate in 5 cleanup events", points: 100, icon: "🧹" },
            tree_planter: { name: "Tree Planter", description: "Plant 10 trees", points: 150, icon: "🌳" },
            community_leader: { name: "Community Leader", description: "Verify 20 reports", points: 200, icon: "👑" },
            eco_educator: { name: "Eco Educator", description: "Complete all eco-knowledge quizzes", points: 75, icon: "📚" }
        };

        this.init();
    }

    init() {
        this.loadUserProgress();
        this.updateLevelDisplay();
    }

    loadUserProgress() {
        this.userPoints = parseInt(localStorage.getItem('userPoints') || '0');
        this.userAchievements = JSON.parse(localStorage.getItem('userAchievements') || '{}');
        this.userLevel = this.calculateCurrentLevel();
    }

    calculateCurrentLevel() {
        let currentLevel = 1;
        for (const [level, data] of Object.entries(this.levels)) {
            if (this.userPoints >= data.points) {
                currentLevel = parseInt(level);
            } else {
                break;
            }
        }
        return currentLevel;
    }

    addPoints(points, action, description) {
        const oldLevel = this.userLevel;
        this.userPoints += points;
        this.userLevel = this.calculateCurrentLevel();
        
        localStorage.setItem('userPoints', this.userPoints.toString());
        
        // Проверка достижений
        this.checkAchievements(action);
        
        // Уведомление о новом уровне
        if (this.userLevel > oldLevel) {
            this.handleLevelUp(oldLevel, this.userLevel);
        }
        
        this.updateLevelDisplay();
        return points;
    }

    checkAchievements(action) {
        const achievementKeys = {
            'REPORT_ISSUE': 'first_report',
            'ATTEND_EVENT': 'cleanup_hero',
            'PLANT_TREE': 'tree_planter',
            'VERIFY_ISSUE': 'community_leader',
            'COMPLETE_QUIZ': 'eco_educator'
        };

        const achievementKey = achievementKeys[action];
        if (achievementKey && !this.userAchievements[achievementKey]) {
            this.unlockAchievement(achievementKey);
        }
    }

    unlockAchievement(achievementKey) {
        const achievement = this.achievements[achievementKey];
        this.userAchievements[achievementKey] = {
            unlocked: true,
            unlockedAt: new Date().toISOString()
        };
        
        localStorage.setItem('userAchievements', JSON.stringify(this.userAchievements));
        
        // Показать уведомление о достижении
        if (window.notifications) {
            window.notifications.show(
                `Достижение разблокировано: ${achievement.name} +${achievement.points} очков!`,
                'success',
                5000
            );
        }
        
        // Добавить очки за достижение
        this.addPoints(achievement.points, 'ACHIEVEMENT', achievement.name);
    }

    handleLevelUp(oldLevel, newLevel) {
        const newLevelData = this.levels[newLevel];
        
        if (window.notifications) {
            window.notifications.show(
                `🎉 Новый уровень! Теперь вы ${newLevelData.title} ${newLevelData.badge}`,
                'success',
                5000
            );
        }

        // Разблокировать награды
        if (newLevelData.rewards.length > 0) {
            setTimeout(() => {
                window.notifications.show(
                    `🎁 Новые награды: ${newLevelData.rewards.join(', ')}`,
                    'info',
                    5000
                );
            }, 1000);
        }
    }

    updateLevelDisplay() {
        // Обновление отображения уровня на странице
        const levelElements = document.querySelectorAll('.user-level, #user-level');
        const progressElements = document.querySelectorAll('.level-progress, #level-progress');
        
        const currentLevelData = this.levels[this.userLevel];
        const nextLevelData = this.levels[this.userLevel + 1];
        const progress = nextLevelData ? 
            ((this.userPoints - currentLevelData.points) / (nextLevelData.points - currentLevelData.points)) * 100 : 100;

        levelElements.forEach(element => {
            element.textContent = `${currentLevelData.title} ${currentLevelData.badge}`;
        });

        progressElements.forEach(element => {
            element.style.width = `${progress}%`;
            element.textContent = `${Math.round(progress)}%`;
        });

        // Обновление очков
        const pointsElements = document.querySelectorAll('#user-points span, #points-count');
        pointsElements.forEach(element => {
            element.textContent = this.userPoints;
        });
    }

    getNextLevelRequirements() {
        const nextLevel = this.userLevel + 1;
        if (this.levels[nextLevel]) {
            const pointsNeeded = this.levels[nextLevel].points - this.userPoints;
            return {
                level: nextLevel,
                pointsNeeded: pointsNeeded,
                title: this.levels[nextLevel].title
            };
        }
        return null;
    }
}

// Инициализация системы уровней
window.levelSystem = new LevelSystem();
