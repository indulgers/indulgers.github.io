import * as THREE from "three";
import {
  ApplySequences,
  BatchedParticleRenderer,
  ConeEmitter,
  ConstantValue,
  DonutEmitter,
  GridEmitter,
  IntervalValue,
  ParticleSystem,
  RandomColor,
  RectangleEmitter,
  TextureSequencer,
  Vector3,
  Vector4,
} from "three.quarks";

const group = new THREE.Group();
const batchRenderer = new BatchedParticleRenderer();
group.add(batchRenderer);

const loader = new THREE.TextureLoader();

// 创建一个异步初始化函数
async function initParticleSystem() {
  const texture = await loader.loadAsync("./point.png");

  // 升级粒子系统 - 优化文字显示效果
  const particles = new ParticleSystem({
    duration: 15, // 延长总时长
    looping: true,
    startLife: new ConstantValue(14), // 延长粒子生命周期
    startSpeed: new ConstantValue(0),
    startSize: new IntervalValue(0.06, 0.12), // 调整粒子大小范围
    startColor: new RandomColor(
      new Vector4(1, 1, 1, 1), // 纯白色
      new Vector4(0.95, 0.98, 1, 1) // 更接近白色
    ),
    emissionOverTime: new ConstantValue(0),
    emissionBursts: [
      {
        time: 0,
        count: new ConstantValue(4000), // 增加粒子数量让文字更清晰
        probability: 1,
      },
    ],
    shape: new GridEmitter({
      width: 30, // 增大网格范围
      height: 30,
      column: 70, // 增加网格密度
      row: 70,
    }),
    material: new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      alphaTest: 0.1, // 添加alpha测试，减少飘逸效果
    }),
  });

  group.add(particles.emitter);
  batchRenderer.addSystem(particles);

  // GitHub头像纹理序列
  const avatarTexture = await loader.loadAsync("./logo_texture.png");
  const avatarSeq = new TextureSequencer(0.08, 0.08, new Vector3(-8, 2, 0));
  avatarSeq.fromImage(avatarTexture.image, 0.15);

  // Full Stack Engineer 文字纹理
  const textTexture = await loader.loadAsync("./text_texture.png");
  const textSeq = new TextureSequencer(0.04, 0.04, new Vector3(0, -2.5, 0));
  textSeq.fromImage(textTexture.image, 0.08); // 更低的阈值

  // GitHub logo 纹理
  const githubTexture = await loader.loadAsync("./logo_texture.png");
  const githubSeq = new TextureSequencer(0.08, 0.08, new Vector3(8, 2, 0));
  githubSeq.fromImage(githubTexture.image, 0.15);

  // 升级序列应用 - 更流畅的转换
  const applySeq = new ApplySequences(0.00008);
  applySeq.appendSequencer(new IntervalValue(2, 4), avatarSeq);
  applySeq.appendSequencer(new IntervalValue(5, 7), textSeq);
  applySeq.appendSequencer(new IntervalValue(8, 10), githubSeq);

  particles.addBehavior(applySeq);

  return { particles, batchRenderer };
}

// 导出初始化函数和组
export { batchRenderer, initParticleSystem };
export default group;
