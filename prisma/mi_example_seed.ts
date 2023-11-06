import { LIFECYCLE, Prisma, PrismaClient } from "@prisma/client";
import { createLearningObjects } from "./seed_functions";

const prisma = new PrismaClient();

const repository = {
    id: "3",
    user: "1",
    name: "MI Repository",
    description: "Example created for the MI-Lecture by Dr. Jörg Cassens",
    taxonomy: "Bloom",
    version: "v1",
};

const skills = [
    //
    {
        id: "3001",
        name: "Änderungen des Mediencharakters",
        description:
            "Grundlegende Änderungen in der Produktion, Distribution und Konsumption von Medien erinnern",
        level: 1,
    },
    {
        id: "3002",
        name: "Medienkonvergenz",
        description: "Begriff der Medienkonvergenz erinnern und verstehen",
        level: 2,
    },
    {
        id: "3003",
        name: "Wandel des Medienkonsums",
        description: "Wandel des Medienkonsums über die Zeit (Vereinzelung) verstehen",
        level: 2,
    },
    {
        id: "3004",
        name: "Auswirkungen der Digitalisierung",
        description:
            "Auswirkungen der Digitalisierung auf die Lebensbereiche des Lernens, der Arbeit und der Freizeit erinnern und verstehen",
        level: 2,
    },
    {
        id: "3005",
        name: "Interdisziplinarität der Medieninformatik",
        description: "Interdisziplinarität der Medieninformatik verstehen",
        level: 2,
    },
    //
    {
        id: "3006",
        name: "Menschliche Sinne in der Medieninformatik",
        description: "Rolle der menschlichen Sinne in der Medieninformatik erinnern",
        level: 1,
    },
    //
    {
        id: "3007",
        name: "Sehzellen im menschlichen Auge",
        description: "Rolle der Sehzellen im menschlichen Auge erinnern",
        level: 1,
    },
    {
        id: "3008",
        name: "Gesetze der Gestaltpsychologie",
        description: "Gesetze der Gestaltpsychologie erinnern und verstehen",
        level: 2,
    },
    //
    {
        id: "3009",
        name: "Eigenschaften des auditiven Systems",
        description:
            "Eigenschaften des auditiven Systems wie die räumliche und zeitliche Auflösung erinnern",
        level: 1,
    },
    {
        id: "3010",
        name: "Bestandteile des menschlichen Ohres",
        description: "Bestandteile des menschlichen Ohres erinnern",
        level: 1,
    },
    {
        id: "3011",
        name: "Wissensbasiertes Hören",
        description: "Konzept des wissensbasierten Hörens verstehen",
        level: 2,
    },
    //
    {
        id: "3012",
        name: "Rolle der Berührungswahrnehmung",
        description: "Anwendungsgebiete der Berührungswahrnehmung in Informatiksystemen erinnern",
        level: 1,
    },
    //
    {
        id: "3013",
        name: "Verarbeitung von Reizen im Gehin",
        description: "Prozess der Verarbeitung von Reizen im menschlichen Gehirn erinnern",
        level: 1,
    },
    {
        id: "3014",
        name: "Erkennen und Abrufen von Information",
        description: "Unterschied zwischen Erkennen und Abrufen von Information zu verstehen",
        level: 2,
    },
    {
        id: "3015",
        name: "Speicherbedarf des menschlichen Erleben",
        description:
            "Speicherbedarf für die menschliches Erleben (Lesen, Hören und Sehen) einordnen und verstehen",
        level: 2,
    },
    //
    {
        id: "3016",
        name: "Motorische Schnittstellen",
        description: "Motorische Schnittstellen interaktiver Medien und Werkzeuge erinnern",
        level: 1,
    },
    {
        id: "3017",
        name: "Motorik als Fehlerursache",
        description:
            "Motorik als Ursache für mögliche Fehler in Computersystemen erinnern und verstehen",
        level: 2,
    },
    //
    {
        id: "3018",
        name: "Human Information Processing Modell",
        description: "Begriff des Human Information Processing Modells erinnern",
        level: 1,
    },
    //
    {
        id: "3019",
        name: "Gesellschaftliche Auswirkungen digitaler Medien",
        description: "Gesellschaftliche Auswirkungen digitaler Medien erinnern verstehen",
        level: 2,
    },
    {
        id: "3020",
        name: "Interaktion zweier Akteure",
        description: "Konzept der Interaktion von zwei Akteuren erinnern und verstehen",
        level: 2,
    },
    {
        id: "3021",
        name: "Computer als Akteur",
        description: "Computer als Akteur verstehen",
        level: 2,
    },
    {
        id: "3022",
        name: "Digitale Entsprechungen",
        description: "Digitale Entsprechungen der nichtdigitalen Welt erinnern",
        level: 1,
    },
    {
        id: "3023",
        name: "Qualitäten digitaler Entsprechungen",
        description: "Qualitäten digitaler Entsprechungen erinnern",
        level: 1,
    },
    //
    {
        id: "3024",
        name: "Medientheorie",
        description:
            "Aufgabe und Interdisziplinarität des Forschungsgebiets der Medientheorie erinnern",
        level: 1,
    },
    {
        id: "3025",
        name: "Bekannte Medientheoretiker",
        description: "Aussagen bekannter Medientheoretiker erinnern und verstehen",
        level: 2,
    },
    //
    {
        id: "3026",
        name: "Aufbau der semiotischen Maschine",
        description: "Aufbau der semiotischen Maschine erinnern",
        level: 1,
    },
    {
        id: "3027",
        name: "Grundlagen der Semiotik",
        description: "Grundlegende Begriffe der Semiotik erinnern und verstehen",
        level: 2,
    },
    //
    {
        id: "3028",
        name: "Mensch-Maschine-Kommunikation",
        description:
            "Grundlagen der Kommunikation zwischen Menschen und Maschine erinnern und verstehen",
        level: 2,
    },
    //
    {
        id: "3029",
        name: "Qualität, Usability und User Experience",
        description:
            "Begriffe der Qualität, Usability und User Experience sowie deren Relationen untereinander erinnern und verstehen",
        level: 2,
    },
];

const skillGroups = [
    {
        id: "3501",
        level: 1,
        name: "Menschen, Medien, Maschinen",
        description: "",
        nested: ["3001", "3002", "3003", "3004", "3005"],
    },
    {
        id: "3502",
        level: 1,
        name: "Visuelles System",
        description: "",
        nested: ["3007", "3008"],
    },
    {
        id: "3503",
        level: 1,
        name: "Auditives System",
        description: "",
        nested: ["3009", "3010", "3011"],
    },
    {
        id: "3504",
        level: 1,
        name: "Gedächtnis",
        description: "",
        nested: ["3013", "3014", "3015"],
    },
    {
        id: "3505",
        level: 1,
        name: "Motorisches System",
        description: "",
        nested: ["3016", "3017"],
    },
    {
        id: "3506",
        level: 1,
        name: "Medien und Interaktion",
        description: "",
        nested: ["3019", "3020", "3021", "3022", "3023"],
    },
    {
        id: "3507",
        level: 1,
        name: "Medien(-theorie)",
        description: "",
        nested: ["3024", "3025"],
    },
    {
        id: "3508",
        level: 1,
        name: "Semiotik",
        description: "",
        nested: ["3026", "3027"],
    },
];

const learningObjectives = [
    // Medieninformatik Kapitel 1: Überblick
    {
        id: "3001",
        name: "Menschen, Medien, Maschinen",
        description: "Menschen, Medien, Maschinen",
        requirements: [],
        teachingGoals: ["3001"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3002",
        name: "Informationsverarbeitung (Intro)",
        description: "Informationsverarbeitung (Intro)",
        requirements: [],
        teachingGoals: ["3006"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3003",
        name: "Visuelles System",
        description: "Visuelles System",
        requirements: [],
        teachingGoals: ["3502"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3004",
        name: "Auditives System",
        description: "Auditives System",
        requirements: [],
        teachingGoals: ["3503"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3005",
        name: "Haptik",
        description: "Haptik",
        requirements: [],
        teachingGoals: ["3012"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3006",
        name: "Gedächtnis",
        description: "Gedächtnis",
        requirements: [],
        teachingGoals: ["3504"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3007",
        name: "Motorisches System",
        description: "Motorisches System",
        requirements: [],
        teachingGoals: ["3505"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3008",
        name: "Human Capabilities (Outro)",
        description: "Human Capabilities (Outro)",
        requirements: [],
        teachingGoals: ["3018"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3009",
        name: "Medien und Interaktion",
        description: "Medien und Interaktion",
        requirements: [],
        teachingGoals: ["3506"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3010",
        name: "Medien(-theorie)",
        description: "Medien(-theorie)",
        requirements: [],
        teachingGoals: ["3507"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3011",
        name: "Semiotik",
        description: "Semiotik",
        requirements: [],
        teachingGoals: ["3508"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
    {
        id: "3012",
        name: "Mensch-Computer-Interaktion",
        description: "Mensch-Computer-Interaktion",
        requirements: [],
        teachingGoals: ["3029"],
        lifecycle: LIFECYCLE.DRAFT,
        orga_id: "2",
    },
];

const learningGoals = [
    {
        id: "3001",
        owner: "orga-3",
        repositoryId: "1",
        name: "Medieninformatik Überblick",
        description: "Überblick über die Inhalte der Medieninformatik",
        goals: ["3501", "3502", "3503", "3504", "3505", "3506", "3507", "3508"],
    },
];

export async function miSeed(): Promise<void> {
    await createRepositories();
    console.log(" - %s\x1b[32m ✔\x1b[0m", "Repositories");
    await createCompetencies();
    console.log(" - %s\x1b[32m ✔\x1b[0m", "Skills");
    await createSkillGroups();
    console.log(" - %s\x1b[32m ✔\x1b[0m", "SkillGroups");
    await createLearningObjects(learningObjectives);
    console.log(" - %s\x1b[32m ✔\x1b[0m", "Learning Objects");
    await createGoals();
    console.log(" - %s\x1b[32m ✔\x1b[0m", "Goals");
}

async function createRepositories() {
    await prisma.skillMap.create({
        data: {
            id: repository.id,
            ownerId: repository.user,
            name: repository.name,
            description: repository.description,
            taxonomy: repository.taxonomy,
            version: repository.version,
        },
    });
}

async function createCompetencies() {
    await Promise.all(
        skills.map(async (competence) => {
            const input: Prisma.SkillUncheckedCreateInput = {
                repositoryId: repository.id,
                ...competence,
            };

            await prisma.skill.create({
                data: input,
            });
        }),
    );
}

async function createSkillGroups() {
    // Need to preserve ordering and wait to be finished before creating the next one!
    for (const skill of skillGroups) {
        const nested = skill.nested?.map((i) => ({ id: i }));

        await prisma.skill.create({
            data: {
                id: skill.id,
                repositoryId: repository.id,
                name: skill.name,
                description: skill.description,
                level: skill.level,
                nestedSkills: {
                    connect: nested,
                },
            },
        });
    }
}
async function createGoals() {
    // Avoid Deadlocks -> Run all in sequence
    for (const goal of learningGoals) {
        await prisma.learningPath.create({
            data: {
                id: goal.id,
                owner: goal.owner,
                title: goal.name,
                description: goal.description,
                pathTeachingGoals: {
                    connect: goal.goals.map((i) => ({ id: i })),
                },
            },
        });
    }
}
