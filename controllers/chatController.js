import { generatePersonalityResult } from "../openaiService.js";
import QuestionAndAnswer from "../models/QuestionAndAnswer.js";
import PersonalityResult from "../models/PersonalityResult.js";

// Helper function to parse personality result string
function parsePersonalityResult(resultString) {
  const sections = resultString.split('---').map(s => s.trim());
  
  // Extract traits from Page 1
  const traitsSection = sections[0];
  const traits = traitsSection.split('\n').filter(line => 
    line.startsWith('**') && line.endsWith('**') && !line.includes('Page 1')
  ).map(line => line.replace(/\*\*/g, ''));

  // Extract MBTI and archetype from Page 2
  const page2 = sections[1];
  const mbtiMatch = page2.match(/\*\*MBTI Code:\*\* (.+)/);
  const archetypeMatch = page2.match(/\*\*Archetype Title:\*\* (.+)/);
  const introLines = page2.split('\n').slice(4);
  const introduction = introLines.join('\n').trim();

  // Extract insights from Page 3
  const page3 = sections[2];
  const insightLines = page3.split('\n').filter(line => line.startsWith('- '));
  const insights = insightLines.map(line => line.replace('- ', ''));

  // Extract affirmation from Page 4
  const page4 = sections[3];
  const affirmation = page4.replace('**Page 4: Affirmation**', '').trim();

  // Extract creator profile from Page 5
  const page5 = sections[4];
  const strengthMatch = page5.match(/\*\*Strength:\*\* (.+)/);
  const uniqueMatch = page5.match(/\*\*Unique Thing:\*\* (.+)/);
  const quoteMatch = page5.match(/\*\*Signature Quote:\*\* (.+)/);
  const roastMatch = page5.match(/\*\*Cute Roast:\*\* (.+)/);

  // Extract static text from Page 6
  const page6 = sections[5];
  const staticText = page6.replace('**Page 6: Static Text**', '').trim();

  return {
    mbtiCode: mbtiMatch?.[1] || 'INFJ',
    archetypeTitle: archetypeMatch?.[1] || 'Visionary Mentor',
    introduction: introduction || '',
    traits: traits.length > 0 ? traits : ['Creative', 'Intuitive', 'Reflective'],
    insights: insights.length > 0 ? insights : [],
    affirmation: affirmation || '',
    strength: strengthMatch?.[1] || '',
    uniqueThing: uniqueMatch?.[1] || '',
    signatureQuote: quoteMatch?.[1] || '',
    cuteRoast: roastMatch?.[1] || '',
    staticText: staticText || ''
  };
}

// Generate and save personality result
export async function generatePersonality(req, res) {
  try {
    const { userId } = req.body;

    console.log(userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    console.log(userId, "bijoy");

    // Check if personality result already exists
    const existingResult = await PersonalityResult.findOne({ userId });
    if (existingResult) {
      return res.status(200).json({ 
        result: existingResult.rawResult,
        parsed: {
          mbtiCode: existingResult.mbtiCode,
          archetypeTitle: existingResult.archetypeTitle,
          introduction: existingResult.introduction,
          traits: existingResult.traits,
          insights: existingResult.insights,
          affirmation: existingResult.affirmation,
          strength: existingResult.strength,
          uniqueThing: existingResult.uniqueThing,
          signatureQuote: existingResult.signatureQuote,
          cuteRoast: existingResult.cuteRoast,
          staticText: existingResult.staticText
        }
      });
    }

    const answers = await QuestionAndAnswer.find({ user_id: userId }).sort({ question_id: 1 });

    console.log(answers, "bijoy");

    if (!answers || answers.length === 0) {
      return res.status(404).json({ message: "No answers found" });
    }

    const allAnswers = answers.map(a => a.answer);

    // Generate personality result from OpenAI
    const personalityReport = await generatePersonalityResult(allAnswers);

    // Parse the result
    const parsedResult = parsePersonalityResult(personalityReport);

    // Save to MongoDB
    const personalityResult = new PersonalityResult({
      userId,
      ...parsedResult,
      rawResult: personalityReport
    });

    await personalityResult.save();

    return res.status(200).json({ 
      result: personalityReport,
      parsed: parsedResult
    });
  } catch (err) {
    console.error("Error in controller:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Get existing personality result
export async function getPersonalityResult(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const personalityResult = await PersonalityResult.findOne({ userId });

    if (!personalityResult) {
      return res.status(404).json({ message: "Personality result not found" });
    }

    return res.status(200).json({
      result: personalityResult.rawResult,
      parsed: {
        mbtiCode: personalityResult.mbtiCode,
        archetypeTitle: personalityResult.archetypeTitle,
        introduction: personalityResult.introduction,
        traits: personalityResult.traits,
        insights: personalityResult.insights,
        affirmation: personalityResult.affirmation,
        strength: personalityResult.strength,
        uniqueThing: personalityResult.uniqueThing,
        signatureQuote: personalityResult.signatureQuote,
        cuteRoast: personalityResult.cuteRoast,
        staticText: personalityResult.staticText
      },
      createdAt: personalityResult.createdAt,
      updatedAt: personalityResult.updatedAt
    });
  } catch (err) {
    console.error("Error fetching personality result:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Update existing personality result (optional)
export async function updatePersonalityResult(req, res) {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const updatedResult = await PersonalityResult.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedResult) {
      return res.status(404).json({ message: "Personality result not found" });
    }

    return res.status(200).json({
      message: "Personality result updated successfully",
      result: updatedResult
    });
  } catch (err) {
    console.error("Error updating personality result:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

// Delete personality result (for retaking test)
export async function deletePersonalityResult(req, res) {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const deletedResult = await PersonalityResult.findOneAndDelete({ userId });

    if (!deletedResult) {
      return res.status(404).json({ message: "Personality result not found" });
    }

    return res.status(200).json({
      message: "Personality result deleted successfully"
    });
  } catch (err) {
    console.error("Error deleting personality result:", err);
    return res.status(500).json({ message: "Server error" });
  }
}